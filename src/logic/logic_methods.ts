export enum InDistance {
    VeryClose,
    Close,
    Medium,
    Far
}

export enum OutParam {
    VerySlow,
    Slow,
    Medium,
    Fast,

    StrongLeft,
    Left,
    Right,
    StrongRight
}

// Определение отношения парамтра к параметру скорости или поворота
export function is_speed(val: OutParam): boolean {
    return val < OutParam.StrongLeft;
}
export interface FuzzyInDist {
    distance: InDistance,
    value: number
}

export interface FuzzySensor {
    values: FuzzyInDist[]
}

export interface FuzzyOutParam {
    param: OutParam,
    value: number
}

// Хуже названияне придумать
export function fip_to_str(val: FuzzyInDist) {
    return `${InDistance[val.distance]}:${val.value}`;
}

export function fop_to_str(val: FuzzyOutParam) {
    return `${OutParam[val.param]}:${val.value}`;
}

// Класс функции, вычисляющей принадлежность классу
class MembershipFunc {
    private intervals: number[];

    constructor(intervals: number[]) {
        this.intervals = intervals;
    }

    eval(val: number): number {
        let ints = this.intervals;
        if (this.excludes(val))
            return 0;
        if (val < ints[1])
            return (val - ints[0]) / (ints[1] - ints[0]);
        if (val > ints[2])
            return (val - ints[3]) / (ints[2] - ints[3]);
        return 1;
    }

    includes(val: number): boolean {
        return val >= this.intervals[0] && val <= this.intervals[3];
    }

    excludes(val: number): boolean {
        return val < this.intervals[0] || val > this.intervals[3];
    }

    intervals_sliced(top_val: number): number[] {
        let ints = this.intervals;
        let a = this.deval_l(top_val);
        let b = this.deval_r(top_val);
        return [ints[0], a, b, ints[3]];
    }

    deval_l(val: number): number {
        return val * (this.intervals[1] - this.intervals[0]) + this.intervals[0];
    }

    deval_r(val: number): number {
        return val * (this.intervals[2] - this.intervals[3]) + this.intervals[3];
    }
}
            //            |______   _____   _____   ____
            //            |      \ /     \ /     \ /
            //            |       ╳       ╳       ╳
            //            |      / \     / \     / \
            //            0__1  2   3   4   5   6   7
var distance_intervals = [0, 0, 10, 20, 30, 40, 50, 60, Infinity, Infinity];

var distance_funcs = new Map<InDistance, MembershipFunc>();
for (let i = 0; i < 4; i++) {
    let arr = distance_intervals.slice(2*i, 2*i + 4);
    distance_funcs.set(i, new MembershipFunc(arr));
}

// Перевод расстояния в нечеткую переменную
export function eval_fuzzy_sensor(distance: number) : FuzzySensor {
    let result = { values: [] } as FuzzySensor;
    for(var i = 0; i < 4; i++) {
        let temp = distance_funcs.get(i)!.eval(distance)
        if (temp != 0)
            result.values.push({
                distance: i,
                value: temp
            });
    }
    return result;
}
            //          |     ____   _____   _____
            //          |\   /    \ /     \ /
            //          |  ╳       ╳       ╳
            //          |/   \    / \     / \
            //         012    3  4   5   6   7
var speed_intervals = [0,0,0, 10, 20, 30, 40, 50, 60, 60]
var pi = Math.PI;
            //            \  / \ | / \  /
            //             \/   \|/   \/
            //             /\   /|\   /\
            //            /  \ / | \ /  \
            //           1    2     3    4
var turn_intervals =  [-3*pi/12, -3*pi/12, -3*pi/12, -pi/12, pi/12, pi/12, pi/12, 3*pi/12, 3*pi/12, 3*pi/12]
var output_funcs = new Map<OutParam, MembershipFunc>();

for (let i = 0; i < 4; i++) {
    let arr = speed_intervals.slice(2*i, 2*i + 4);
    output_funcs.set(i, new MembershipFunc(arr));
}

for (let i = 0; i < 4; i++) {
    let arr = turn_intervals.slice(2*i, 2*i + 4);
    output_funcs.set(i + 4, new MembershipFunc(arr));
}

console.log(output_funcs.get(OutParam.StrongLeft)!);
interface Point {
    x: number,
    y: number
}

export function merge_params(params: FuzzyOutParam[]): Point[] {
    let points: Point[] = [];
    if (params.length == 0)
        return [];
    let param = params[0];
    let func = output_funcs.get(param.param)!;
    let ints = func.intervals_sliced(param.value);
    points.push({x: ints[0], y: 0});
    points.push({x: ints[1], y: param.value});
    let last_point: Point = {x: ints[2], y: param.value};

    for (let i = 1; i < params.length; i++) {
        param = params[i];
        func = output_funcs.get(param.param)!;
        ints = func.intervals_sliced(param.value);

        if (param.value > 0.5 && last_point.y > 0.5) {
            points.push(last_point);
            points.push({
                x: func.deval_l(0.5),
                y: 0.5
            });
            points.push({
                x: ints[1],
                y: param.value
            });
        }
        else if (param.value > last_point.y) {
            points.push({
                x: func.deval_l(last_point.y),
                y: last_point.y
            });
            points.push({
                x: ints[1],
                y: param.value
            });
        }
        else {
            points.push(last_point);
            points.push({
                x: func.deval_l(1 - param.value),
                y: param.value
            });
        }
        last_point = {x: ints[2], y: param.value};
    }
    points.push(last_point);
    points.push({x: ints[3], y: 0});
    return points;
}
export function  eval_params(points: Point[]) {
    if (points.length == 0)
        return 0;
    let sum1 = 0;
    let sum2 = 0;
    for (let i = 0; i < points.length - 1; i++) {
        let a = points[i];
        let b = points[i + 1];
        sum1 += b.x * a.y - a.x * b.y;
        sum2 += (a.x + b.x) * (b.x * a.y - a.x * b.y);
    }
    return (sum2 / sum1) / 3;
}

// let ins: FuzzyOutParam[] = [
//     {
//         param: OutParam.Slow,
//         value: 0.6
//     },
//     {
//         param: OutParam.Medium,
//         value: 0.6
//     }
// ];
// let points = merge_params(ins);
// console.log(points);
// console.log(eval_params(points));
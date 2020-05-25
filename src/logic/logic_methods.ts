import { FI } from "./function_intervals";

export enum InParam {
    VeryClose,
    Close,
    Medium,
    Far,

    StrongLeft,
    Left,
    Right,
    StrongRight,

    TClose,
    TFar
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
export interface FuzzyInParam {
    distance: InParam,
    value: number
}

export interface FuzzySensor {
    values: FuzzyInParam[]
}

export interface FuzzyOutParam {
    param: OutParam,
    value: number
}

// Класс функции, вычисляющей принадлежность классу
class MembershipFunc {
    private intervals: number[];

    constructor(intervals: number[]) {
        this.intervals = intervals;
    }

    eval(val: number): number {
        let ints = this.intervals;
        if (val < ints[0] || val > ints[3])
            return 0;
        if (val < ints[1])
            return (val - ints[0]) / (ints[1] - ints[0]);
        if (val > ints[2])
            return (val - ints[3]) / (ints[2] - ints[3]);
        return 1;
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

export var in_dist_funcs = new Map<InParam, MembershipFunc>();
export var in_angl_funcs = new Map<InParam, MembershipFunc>();
export var in_t_dist_funcs = new Map<InParam, MembershipFunc>();

for (let i = 0; i < 4; i++) {
    let arr = FI.distance.slice(2*i, 2*i + 4);
    in_dist_funcs.set(i, new MembershipFunc(arr));
}

for (let i = 0; i < 4; i++) {
    let arr = FI.angle.slice(2*i, 2*i + 4);
    in_angl_funcs.set(i + 4, new MembershipFunc(arr));
}

for (let i = 0; i < 2; i++) {
    let arr = FI.target_dist.slice(2*i, 2*i + 4);
    in_t_dist_funcs.set(i + 8, new MembershipFunc(arr));
}

// Перевод расстояния в нечеткую переменную
export function eval_fuzzy_sensor(distance: number, func_col: Map<InParam, MembershipFunc>) : FuzzySensor {
    let result = { values: [] } as FuzzySensor;
    func_col.forEach((func: MembershipFunc, param: InParam) => {
        let temp = func.eval(distance)
        if (temp != 0)
            result.values.push({
                distance: param,
                value: temp
            });
    });
    return result;
}

var output_funcs = new Map<OutParam, MembershipFunc>();

for (let i = 0; i < 4; i++) {
    let arr = FI.speed.slice(2*i, 2*i + 4);
    output_funcs.set(i, new MembershipFunc(arr));
}

for (let i = 0; i < 4; i++) {
    let arr = FI.turn.slice(2*i, 2*i + 4);
    output_funcs.set(i + 4, new MembershipFunc(arr));
}
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
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

    Left,
    Right,
    StrongLeft,
    StrongRight
}

// Определение отношения парамтра к параметру скорости или поворота
export function is_speed(val: OutParam): boolean {
    return val < OutParam.Left;
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
        let intervals = this.intervals;
        if (val < intervals[0] || val > intervals[3])
            return 0;
        if (val < intervals[1])
            return (val - intervals[0]) / (intervals[1] - intervals[0]);
        if (val > intervals[2])
            return (val - intervals[3]) / (intervals[2] - intervals[3]);
        return 1;
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
var speed_intervals = [0,0,0, 5, 10, 15, 20, 25, Infinity, Infinity]
var speed_funcs = new Map<OutParam, MembershipFunc>();
for (let i = 0; i < 4; i++) {
    let arr = speed_intervals.slice(2*i, 2*i + 4);
    speed_funcs.set(i, new MembershipFunc(arr));
}


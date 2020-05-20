enum InDistance {
    VeryClose,
    Close,
    Medium,
    Far
}

enum OutSpeed {
    Slow,
    Medium,
    Fast
}

interface InDistVal {
    distance: InDistance,
    value: number
}

class MembershipFunc {
    private intervals: number[];

    constructor(intervals: number[]) {
        this.intervals = intervals;
    }

    eval(val: number) {
        let intervals = this.intervals;
        if (val < intervals[0] || val >= intervals[3])
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
var init_intervals = [0, 0, 10, 20, 30, 40, 50, 60, Infinity, Infinity];

var distance_funcs = new Map<InDistance, MembershipFunc>();
for (let i = 0; i < 4; i++) {
    let arr = init_intervals.slice(2*i, 2*i + 4);
    distance_funcs.set(i, new MembershipFunc(arr));
}

class LogicRule {
    private antecedent: (InDistance | null)[];
    private consequent: OutSpeed;

    constructor(antecedent: (InDistance | null)[], consequent: OutSpeed) {
        if (antecedent.length != 3)
            throw "INCORRECT ANTECEDENT IN RULE";
        this.antecedent = antecedent;
        this.consequent = consequent;
    }

    apply(inputs: InDistVal[][]) {
        let result = 1;
        for (let i = 0; i < 3; i++) {
            if (this.antecedent[i] == null)
                continue;
            let temp = inputs[i].find(x => x.distance == this.antecedent[i]);
            if (temp === undefined)
                return null;
            if (temp.value < result)
                result = temp.value;
        }
        return result;
    }
}

export function evalFuzzySpeed(distance: number) {
    let result: InDistVal[] = [];
    for(var i = 0; i < 4; i++) {
        let temp = distance_funcs.get(i)!.eval(distance)
        if (temp != 0)
            result.push({
                distance: i,
                value: temp
            });
    }

    return result;
}
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

interface OutSpeedVal {
    speed: OutSpeed,
    value: number
}

class MembershipFunc {
    private intervals: number[];

    constructor(intervals: number[]) {
        this.intervals = intervals;
    }

    eval(val: number) {
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

    apply(inputs: InDistVal[][]) : OutSpeedVal | null {
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
        return {
            speed: this.consequent,
            value: result
        };
    }
}

var logic_rules: LogicRule[] = [
    new LogicRule([null, InDistance.Far, null], OutSpeed.Fast),
    new LogicRule([null, InDistance.Medium, null], OutSpeed.Medium),
    new LogicRule([null, InDistance.Close, null], OutSpeed.Slow)
];

export function evalFuzzyDist(distance: number) : InDistVal[] {
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

export function evalFuzzySpeed(sensors_distance: number[]) : OutSpeedVal[] {
    let fuzzy_distances = sensors_distance.map(evalFuzzyDist);
    let result: OutSpeedVal[] = [];
    for (var rule of logic_rules) {
        let temp = rule.apply(fuzzy_distances);
        if (temp != null)
            result.push(temp);
    }
    console.log(OutSpeed[result[0].speed], result[0].value);
    return result;
}
import { debug_div } from "../base/helpers";
import { evalFuzzySensor, FuzzySensor, FuzzyOutParam, is_speed, fopToStr, fipToStr } from "./logic_methods";
import { LOGIC_RULES } from "./logic_rule";

export class LogicStatus {
    private fuzzy_inputs: FuzzySensor[] = [];
    private fuzzy_speed:  FuzzyOutParam[] = [];
    private fuzzy_turn:   FuzzyOutParam[] = [];

    constructor() {}

    public update(sensor_values: number[]) {
        this.fuzzy_inputs = sensor_values.map(evalFuzzySensor);
        this.evalFuzzyOutParams();
        this.print_info();
    }

    private reset_outputs() {
        this.fuzzy_speed = [];
        this.fuzzy_turn = [];
    }

    private evalFuzzyOutParams() {
        this.reset_outputs();
        for (let rule of LOGIC_RULES) {
            let temp = rule.apply(this.fuzzy_inputs);
            if (temp != null) {
                if (is_speed(temp.param))
                    this.fuzzy_speed.push(temp);
                else
                    this.fuzzy_turn.push(temp);
                // debug_div.add(fopToStr(temp));
            }
        }
    }

    private print_info() {
        this.fuzzy_inputs.forEach((sensor) => {
            let str = "[";
            sensor.values.forEach(element => {
                str += `${fipToStr(element)} `;
            });
            str += ']';
            debug_div.add(str);
        });
        debug_div.new_line();
        this.fuzzy_speed.forEach((value) => {
            debug_div.add(fopToStr(value));
        });
        debug_div.new_line();
        this.fuzzy_turn.forEach((value) => {
            debug_div.add(fopToStr(value));
        });
    }
}

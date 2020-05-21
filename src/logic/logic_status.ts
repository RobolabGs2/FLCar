import { info_display } from "../base/info_display";
import { eval_fuzzy_sensor, FuzzySensor, FuzzyOutParam, is_speed, fopToStr, fipToStr } from "./logic_methods";
import { LOGIC_RULES } from "./logic_rule";

export class LogicStatus {
    private fuzzy_inputs: FuzzySensor[] = [];
    private fuzzy_speed:  FuzzyOutParam[] = [];
    private fuzzy_turn:   FuzzyOutParam[] = [];

    constructor() {}

    public update(sensor_values: number[]) {
        this.fuzzy_inputs = sensor_values.map(eval_fuzzy_sensor);
        this.eval_fuzzy_out_params();
        this.print_info();
    }

    private reset_outputs() {
        this.fuzzy_speed = [];
        this.fuzzy_turn = [];
    }

    private eval_fuzzy_out_params() {
        this.reset_outputs();
        for (let rule of LOGIC_RULES) {
            let temp = rule.apply(this.fuzzy_inputs);
            if (temp != null) {
                if (is_speed(temp.param))
                    this.fuzzy_speed.push(temp);
                else
                    this.fuzzy_turn.push(temp);
            }
        }
    }

    private print_info() {
        info_display.print_sensors_fuzzy(this.fuzzy_inputs);
        info_display.print_fuzzy_speed(this.fuzzy_speed);
        info_display.print_fuzzy_turn(this.fuzzy_turn);
    }
}

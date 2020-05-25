import { info_display } from "../base/info_display";
import { eval_fuzzy_sensor, FuzzySensor, FuzzyOutParam, is_speed, merge_params, eval_params } from "./logic_methods";
import { LOGIC_RULES } from "./logic_rule";

export class LogicStatus {
    private fuzzy_inputs: FuzzySensor[] = [];
    private fuzzy_speed:  FuzzyOutParam[] = [];
    private fuzzy_turn:   FuzzyOutParam[] = [];
    output_speed: number = 0;
    output_turn: number = 0;

    constructor() {}

    public update(sensor_values: number[]) {
        this.fuzzy_inputs = sensor_values.map(eval_fuzzy_sensor);
        this.eval_fuzzy_out_params();
        this.output_speed = eval_params(merge_params(this.fuzzy_speed));
        this.output_turn = eval_params(merge_params(this.fuzzy_turn));
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
                    this.add_out_param(temp, this.fuzzy_speed);
                else
                    this.add_out_param(temp, this.fuzzy_turn);
            }
        }
    }

    // В идеале замутить бы бинарный поиск, но мне лень
    private add_out_param(param: FuzzyOutParam, collection: FuzzyOutParam[]) {
        let i = 0;
        while (i < collection.length) {
            let elem = collection[i];
            if (param.param < elem.param)
                break;
            if (param.param == elem.param) {
                if (param.value > elem.value)
                    elem.value = param.value;
                return;
            }
        }
        collection.splice(i, 0, param);
    }

    private print_info() {
        info_display.print_sensors_fuzzy(this.fuzzy_inputs);
        info_display.print_fuzzy_speed(this.fuzzy_speed);
        info_display.print_fuzzy_turn(this.fuzzy_turn);
    }
}

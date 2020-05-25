import { FuzzyOutParam, FuzzySensor, InDistance, is_speed, OutParam} from "../logic/logic_methods";
import "./info_dispaly.css"

export class InfoDisplay {
    private div_sensors_distance: HTMLElement;
    private div_sensors_fuzzy: HTMLElement;
    private div_fuzzy_speed: HTMLElement;
    private div_fuzzy_turn: HTMLElement;
    private html_by_param = new Map<OutParam, HTMLElement>();
    private html_by_distance: Map<InDistance, HTMLElement>[];

    constructor() {
        this.html_by_distance = new Array(3).fill(1).map(() => new Map<InDistance, HTMLElement>());
        this.div_sensors_distance = document.getElementById("sensors-distance")!;
        this.div_sensors_fuzzy = document.getElementById("sensors-fuzzy")!;
        for (let sensor = 0; sensor < 3; sensor++) {
            const sensor_html = document.createElement('section');
            sensor_html.classList.add('outparams');
            for (let i in InDistance) {
                if (!Number.isNaN(parseInt(i))) { // skip numbers
                    continue
                }
                const elem = document.createElement("article");
                const header = document.createElement('header');
                header.innerText = i;
                const data = document.createElement('section');
                elem.append(header, data);
                const param = InDistance[i] as unknown as InDistance;
                this.html_by_distance[sensor].set(param, data);
                sensor_html.append(elem)
            }
            this.div_sensors_fuzzy.append(sensor_html);
        }
        this.div_fuzzy_speed = document.getElementById("fuzzy-speed")!;
        this.div_fuzzy_turn = document.getElementById("fuzzy-turn")!;
        for (let i in OutParam) {
            if (!Number.isNaN(parseInt(i))) { // skip numbers
                continue
            }
            const elem = document.createElement("article");
            const header = document.createElement('header');
            header.innerText = i;
            const data = document.createElement('section');
            elem.append(header, data);
            const param = OutParam[i] as unknown as OutParam;
            this.html_by_param.set(param, data);
            if (is_speed(param)) {
                this.div_fuzzy_speed.append(elem)
            } else {
                this.div_fuzzy_turn.append(elem)
            }
        }
    }

    print_sensors_distance(sensors_distance: number[]) {
        let elems = this.div_sensors_distance.getElementsByClassName("sensor-dist");
        for (let i = 0; i < elems.length; i++) {
            let elem = elems.item(i)!;
            elem.innerHTML = sensors_distance[i].toString();
        }
    }

    print_sensors_fuzzy(sensors_fuzzy: FuzzySensor[]) {
        sensors_fuzzy.forEach((value, i) => {
            let htmlMap = this.html_by_distance[i];
            htmlMap.forEach((value, key) => {
                value.innerText = `0`;
            });
            value.values.forEach(element => htmlMap.get(element.distance)!.innerText = element.value.toFixed(2).toString());
        });
    }

    print_fuzzy_speed(fuzzy_speeds: FuzzyOutParam[]) {
        this.print_fuzzy_out_params(fuzzy_speeds, is_speed);
    }

    print_fuzzy_turn(fuzzy_turns: FuzzyOutParam[]) {
        this.print_fuzzy_out_params(fuzzy_turns, p => !is_speed(p));
    }

    private print_fuzzy_out_params(params: FuzzyOutParam[], filter: (p: OutParam) => boolean) {
        this.html_by_param.forEach((value, key) => {
            if (filter(key)) {
                value.innerText = `0`;
            }
        });
        params.forEach(speed => this.html_by_param.get(speed.param)!.innerText = speed.value.toFixed(2).toString())
    }
}

export var info_display = new InfoDisplay();

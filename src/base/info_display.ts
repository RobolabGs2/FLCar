import {FuzzyOutParam, FuzzySensor, InParam, is_speed, is_target, OutParam} from "../logic/logic_methods";
import "./info_dispaly.css"

function toString(n: number) {
    if (Number.isFinite(n)) {
        return n.toFixed(2).toString()
    }
    return `&#8734` // Знак бесконечности в html
}

export class InfoDisplay {
    private div_sensors_distance: HTMLElement;
    private html_by_param = new Map<OutParam, HTMLElement>();
    private html_by_distance: Map<InParam, HTMLElement>[];
    private html_by_target: Map<InParam, HTMLElement>;

    // Куча копипасты, кошмар, но дженерик от enum быстро сделать не смог
    constructor() {
        this.html_by_distance = new Array(3).fill(1).map(() => new Map<InParam, HTMLElement>());
        this.html_by_target = new Map<InParam, HTMLElement>();
        this.div_sensors_distance = document.getElementById("sensors-distance")!;
        const div_sensors_fuzzy = document.getElementById("sensors-fuzzy")!;
        const div_sensors_target = document.getElementById("sensor-fuzzy-target")!;
        for (let sensor = 0; sensor < 3; sensor++) {
            const sensor_html = document.createElement('section');
            sensor_html.classList.add('outparams');
            for (let i in InParam) {
                if (!Number.isNaN(parseInt(i))) { // skip numbers
                    continue
                }
                const param = InParam[i] as unknown as InParam;
                if (is_target(param)) {
                    continue
                }
                const elem = document.createElement("article");
                const header = document.createElement('header');
                header.innerText = i;
                const data = document.createElement('section');
                elem.append(header, data);
                this.html_by_distance[sensor].set(param, data);
                sensor_html.append(elem)
            }
            div_sensors_fuzzy.append(sensor_html);
        }
        for (let i in InParam) {
            if (!Number.isNaN(parseInt(i))) { // skip numbers
                continue
            }
            const param = InParam[i] as unknown as InParam;
            if (!is_target(param)) {
                continue
            }
            const elem = document.createElement("article");
            const header = document.createElement('header');
            header.innerText = i;
            const data = document.createElement('section');
            elem.append(header, data);
            this.html_by_target.set(param, data);
            div_sensors_target.append(elem)
        }
        const div_fuzzy_speed = document.getElementById("fuzzy-speed")!;
        const div_fuzzy_turn = document.getElementById("fuzzy-turn")!;
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
                div_fuzzy_speed.append(elem)
            } else {
                div_fuzzy_turn.append(elem)
            }
        }
    }

    print_sensors_distance(sensors_distance: number[]) {
        let elems = this.div_sensors_distance.getElementsByClassName("sensor-dist");
        for (let i = 0; i < elems.length; i++) {
            let elem = elems.item(i)!;
            elem.innerHTML = Number.isFinite(sensors_distance[i]) ? sensors_distance[i].toString() : `&#8734`;
        }
    }

    print_sensors_fuzzy(sensors_fuzzy: FuzzySensor[]) {
        this.html_by_target.forEach((value, key) => {
            value.innerText = `0`;
        });
        sensors_fuzzy.forEach((value, i) => {
            let htmlMap: Map<InParam, HTMLElement> | null = null;
            if (i > 2) {
                htmlMap = this.html_by_target;
            } else {
                htmlMap = this.html_by_distance[i];
                htmlMap.forEach((value, key) => {
                    value.innerText = `0`;
                });
            }
            if (htmlMap) {
                value.values.forEach(element => htmlMap?.get(element.distance)!.innerText = element.value.toFixed(2).toString());
            }
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
        params.forEach(speed => this.html_by_param.get(speed.param)!.innerText = toString(speed.value))
    }
}

export var info_display = new InfoDisplay();

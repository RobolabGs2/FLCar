import { FuzzySensor, FuzzyOutParam, fip_to_str, fop_to_str } from "../logic/logic_methods";

export class InfoDisplay {
  private div_sensors_distance: HTMLElement;
  private div_sensors_fuzzy: HTMLElement;
  private div_fuzzy_speed: HTMLElement;
  private div_fuzzy_turn: HTMLElement;

  constructor() {
    this.div_sensors_distance = document.getElementById("sensors-distance")!;
    this.div_sensors_fuzzy = document.getElementById("sensors-fuzzy")!;
    this.div_fuzzy_speed = document.getElementById("fuzzy-speed")!;
    this.div_fuzzy_turn = document.getElementById("fuzzy-turn")!;
  }

  print_sensors_distance(sensors_distance: number[]) {
    let elems = this.div_sensors_distance.getElementsByClassName("sensor-dist");
    for (let i = 0; i < elems.length; i++) {
      let elem = elems.item(i)!;
      elem.innerHTML = sensors_distance[i].toString();
    }
  }

  print_sensors_fuzzy(sensors_fuzzy: FuzzySensor[]) {
    let elems = this.div_sensors_fuzzy.getElementsByClassName("sensor-fuzzy");
    for (let i = 0; i < elems.length; i++) {
      let elem = elems.item(i)!;
      let str = "";
      sensors_fuzzy[i].values.forEach(element => {
          str += `<span>${fip_to_str(element)}<span>`;
      });
      elem.innerHTML = str;
    }
  }

  print_fuzzy_speed(fuzzy_speeds: FuzzyOutParam[]) {
    let str = "";
    for (let speed of fuzzy_speeds) {
      str += `<span>${fop_to_str(speed)}</span>`;
    }
    this.div_fuzzy_speed.innerHTML = str;
  }

  print_fuzzy_turn(fuzzy_turns: FuzzyOutParam[]) {
    let str = "";
    for (let turn of fuzzy_turns) {
      str += `<span>${fop_to_str(turn)}</span>`;
    }
    this.div_fuzzy_turn.innerHTML = str;
  }
}

export var info_display = new InfoDisplay();
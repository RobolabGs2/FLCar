import {Drawer} from "./graphics/drawer";
import {BlankMap} from "./graphics/blank_map";

import { SingleEntryPlugin } from "webpack";

let canvas = document.getElementById('main') as HTMLCanvasElement;
let drawer = new Drawer(canvas);
let map = new BlankMap()

export function test() {
     map._car._angle = 0;
}

(document.getElementById('test') as HTMLButtonElement).addEventListener('click', ev => test());

setInterval(() => {
    map._car._angle += 0.1;
    map._car._coords.x += Math.sin(map._car.angle()) * 10;
    map._car._coords.y += Math.cos(map._car.angle()) * 10;
    drawer.draw(map);
}, 100);

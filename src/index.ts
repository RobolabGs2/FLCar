import {Drawer} from "./graphics/drawer";
import {BlankMap} from "./base/entities";
import { SingleEntryPlugin } from "webpack";

let canvas = document.getElementById('main') as HTMLCanvasElement;

let drawer = new Drawer(canvas);

let map = new BlankMap()

setInterval(() => {
    map._car.angle += 0.1;
    map._car.coordinates.x += Math.sin(map._car.angle * 10);
    map._car.coordinates.y += Math.cos(map._car.angle * 10);
    drawer.draw(map)
}, 100);

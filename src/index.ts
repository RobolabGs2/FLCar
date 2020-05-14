import {Drawer} from "./graphics/drawer";
import {BlankCar, BlankMap} from "./base/entities";
import {downloadBitmap} from "./image/helpers";
import {Point} from "./base/geometry";

let canvas = document.getElementById('main') as HTMLCanvasElement;
let drawer = new Drawer(canvas);
Promise.all(["map.png", "car.png"].map(downloadBitmap))
    .then(function ([mapBitmap, carBitmap]) {
        let map = new BlankMap(mapBitmap, new BlankCar(carBitmap));
        map.car.coordinates.x = 500;
        map.car.coordinates.y = 500;
        setInterval(() => {
            map.car.angle += 0.05;
            map.car.coordinates.x += Math.sin(map.car.angle * 10);
            map.car.coordinates.y += Math.cos(map.car.angle * 10);
            drawer.draw(map);
        }, 50);
    });
// (document.getElementById('test') as HTMLButtonElement).addEventListener('click', ev => console.log("TODO"));



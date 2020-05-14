import {Drawer} from "./graphics/drawer";
import {BlankCar, BlankMap} from "./base/entities";
import {downloadBitmap, extractImageData} from "./image/helpers";
import {Point} from "./base/geometry";

class PhysicsMap {
    constructor(private img: ImageData) {
    }

    is_barrier(p: Point): boolean {
        if (p.x < 0 || p.y < 0 || p.x > this.img.width || p.y > this.img.height) {
            return true
        }
        let offset = (p.x + p.y * this.img.width) * 4;
        return 255 !== [0, 1, 2].map(i => this.img.data[offset + i]).reduce((a, b) => Math.min(a, b))
    }
}

let canvas = document.getElementById('main') as HTMLCanvasElement;
let drawer = new Drawer(canvas);
Promise.all(["map.png", "car.png"].map(downloadBitmap))
    .then(function ([mapBitmap, carBitmap]) {
        const phMap = new PhysicsMap(extractImageData(mapBitmap));
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



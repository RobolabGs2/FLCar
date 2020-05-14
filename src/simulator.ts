import {Drawer} from "./graphics/drawer";
import {extractImageData} from "./image/helpers";
import {BlankCar, BlankMap} from "./base/entities";
import {Point} from "./base/geometry";

export type Settings = {
    map: ImageBitmap,
    car: ImageBitmap,
}

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

export class Simulator {
    private lastTimer = 0;

    constructor(private drawer: Drawer) {
    }

    startSimulation(settings: Settings) {
        if (this.lastTimer !== 0) {
            window.clearInterval(this.lastTimer);
        }
        const phMap = new PhysicsMap(extractImageData(settings.map));
        let map = new BlankMap(settings.map, new BlankCar(settings.car));
        map.car.coordinates.x = 500;
        map.car.coordinates.y = 500;
        this.lastTimer = window.setInterval(() => {
            map.car.angle += 0.05;
            map.car.coordinates.x += Math.sin(map.car.angle * 10);
            map.car.coordinates.y += Math.cos(map.car.angle * 10);
            this.drawer.draw(map);
        }, 50);
    }
}
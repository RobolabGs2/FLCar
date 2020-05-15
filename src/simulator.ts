import {Drawer} from "./graphics/drawer";
import {extractImageData} from "./image/helpers";
import {BlankCar, BlankMap} from "./base/entities";
import {Point} from "./base/geometry";
import { PhisicsContext } from "./phisics/phisics";

export type Settings = {
    map: ImageBitmap,
    car: ImageBitmap,
}

export class Simulator {
    private lastTimer = 0;

    constructor(private drawer: Drawer) {
    }

    startSimulation(settings: Settings) {
        if (this.lastTimer !== 0) {
            window.clearInterval(this.lastTimer);
        }
        let map = new BlankMap(settings.map, new BlankCar(settings.car));
        map.car.coordinates.x = 500;
        map.car.coordinates.y = 500;
        let ph = new PhisicsContext(map);
        this.lastTimer = window.setInterval(() => {
            ph.tick(0.05);
            this.drawer.draw(map);
        }, 50);
    }
}
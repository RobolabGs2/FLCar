import {Drawer} from "./graphics/drawer";
import {extractImageData} from "./image/helpers";
import {BlankCar, BlankMap} from "./base/entities";
import {Point} from "./base/geometry";
import { PhisicsContext } from "./phisics/phisics";
import { Logic } from "./logic/logic";

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
        let logic = new Logic(map);
        this.lastTimer = window.setInterval(() => {
            let dt = 0.05;
            ph.tick(dt);
            logic.tick(dt);
            this.drawer.draw(map);
        }, 50);
    }
}
import {Drawer} from "./graphics/drawer";
import {BlankCar, BlankMap, CarSettings} from "./base/entities";
import {Point} from "./base/geometry";
import {PhisicsContext} from "./phisics/phisics";
import {Logic} from "./logic/logic";


export const DEFAULT_CAR = {
    turn_radius: 15,
    max_speed: 18,
    acceleration: 10,
    sensor_len: 105,
    coordinates: new Point(500, 500),
    angle: 0,
};

export const DEFAULT_TARGET = new Point(100, 200);

export type Settings = {
    map: ImageBitmap,
    car: ImageBitmap,
    car_settings: CarSettings,
    target: Point,
}

export class Simulator {
    private lastTimer = 0;
    public context: {map: BlankMap, car: BlankCar} | null = null;
    public pause: boolean = false;

    constructor(private drawer: Drawer) {
    }

    setTarget(target: Point) {
        if (this.context != null) {
            this.context.map.target = target;
        }
    }

    startSimulation(settings: Settings) {
        if (this.lastTimer !== 0) {
            window.clearInterval(this.lastTimer);
        }
        let map = new BlankMap(settings.map, new BlankCar(settings.car, settings.car_settings), settings.target);
        map.car.coordinates = settings.car_settings.coordinates;
        let ph = new PhisicsContext(map);
        this.context = {map, car: map.car};
        let logic = new Logic(map);
        this.lastTimer = window.setInterval(() => {
            let dt = 0.05;
            if (!this.pause) {
                ph.tick(dt);
                logic.tick(dt);
            }
            this.drawer.draw(map);
        }, 50);
    }
}
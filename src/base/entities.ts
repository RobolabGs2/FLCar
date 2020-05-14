import {Point} from "geometry";
import {DrawableActor, DrawableMap} from "../graphics/drawer";
import {PhisicsActor} from "../phisics/phisics";

export class BlankCar implements DrawableActor, PhisicsActor {
    angle: number;
    coordinates: Point;
    speed: number;
    necessary_speed: number;
    wheel_angle: number;

    public constructor(readonly view: ImageBitmap) {
        this.angle = 0;
        this.coordinates = {x: 0, y: 0};
        this.speed = 0;
        this.necessary_speed = 10;
        this.wheel_angle = 1;
    }
}

export class BlankMap implements DrawableMap {
    public constructor(readonly stage: ImageBitmap, public car: BlankCar) {
    }

    public actors(): Array<DrawableActor> {
        return [this.car];
    }
}

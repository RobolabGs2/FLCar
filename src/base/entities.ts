import {Point} from "./geometry";
import {DrawableActor, DrawableMap} from "../graphics/drawer";
import {PhisicsActor, PhisicsMap} from "../phisics/phisics";
import {extractImageData} from "../image/helpers";

export class BlankCar implements DrawableActor, PhisicsActor {
    angle: number;
    coordinates: Point;
    speed: number;
    necessary_speed: number;
    wheel_angle: number;

    public get height(){
        return this.view.height;
    }

    public get width(){
        return this.view.width;
    }

    public constructor(readonly view: ImageBitmap) {
        this.angle = 0;
        this.coordinates = new Point(0, 0);
        this.speed = 0;
        this.necessary_speed = 100;
        this.wheel_angle = 0.005;
    }
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

export class BlankMap extends PhysicsMap implements DrawableMap, PhisicsMap {
    public constructor(readonly stage: ImageBitmap, public car: BlankCar) {
        super(extractImageData(stage))
    }

    public actors() {
        return [this.car];
    }
}

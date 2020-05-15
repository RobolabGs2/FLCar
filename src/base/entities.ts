import {Point} from "./geometry";
import {DrawableActor, DrawableMap} from "../graphics/drawer";
import {PhisicsActor, PhisicsMap, PhisicsSensor} from "../phisics/phisics";
import {extractImageData} from "../image/helpers";
import { LogicActor, LogicSensor, LogicMap } from "../logic/logic";

export class BlankSensor implements PhisicsSensor, LogicSensor{
    //  Дальность измерения датчика
    distance: number;

    //  Угол поворота относительно машинки
    angle: number;

    //  Значение сенсора - расстояние до препятствия
    value: number;

    constructor(distance: number, angle: number){
        this.value = 0;
        this.distance = distance;
        this.angle = angle;
    }
}

export class BlankCar implements DrawableActor, PhisicsActor, LogicActor {
    angle: number;
    coordinates: Point;
    speed: number;
    necessary_speed: number;
    wheel_angle: number;
    sensors: Array<BlankSensor>;

    public constructor(readonly view: ImageBitmap) {
        this.angle = 0;
        this.coordinates = new Point(0, 0);
        this.speed = 0;
        this.necessary_speed = 100;
        this.wheel_angle = 0.005;
        this.sensors = [new BlankSensor(100, 0)]
    }

    public get height() {
        return this.view.height;
    }

    public get width() {
        return this.view.width;
    }
}

class PhysicsMap {
    private readonly map: Uint8Array;
    private readonly height: number;
    private readonly width: number;

    constructor(img: ImageData) {
        this.height = img.height;
        this.width = img.width;
        this.map = new Uint8Array(img.height * img.width);
        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = [0, 1, 2].map(j => img.data[4 * i + j]).reduce((a, b) => Math.min(a, b))
        }
    }

    is_barrier(p: Point): boolean {
        if (p.x < 0 || p.y < 0 || p.x > this.width || p.y > this.height) {
            return true
        }
        return 255 !== this.map[p.x + p.y * this.width]
    }
}

export class BlankMap extends PhysicsMap implements DrawableMap, PhisicsMap, LogicMap {
    public constructor(readonly stage: ImageBitmap, public car: BlankCar) {
        super(extractImageData(stage))
    }

    public actors() {
        return [this.car];
    }
}

import { Point } from "geometry";
import {MaybeBitmap, get_bitmap, DrawableMap, DrawableActor} from "../graphics/drawer";
import {PhisicsActor, PhisicsMap} from "../phisics/phisics";

export class BlankCar implements DrawableActor, PhisicsActor {
    private _view: MaybeBitmap;
    angle : number;
    coordinates: Point;
    speed: number;
    necessary_speed: number;
    wheel_angle: number;

    public view(): MaybeBitmap {
        return this._view;
    }

    public constructor() {
        this._view =  get_bitmap("car.png");
        this.angle = 0;
        this.coordinates = { x: 500, y: 500 };
        this.speed = 0;
        this.necessary_speed = 10;
        this.wheel_angle = 1;
    }
}

export class BlankMap implements DrawableMap {
    private _stage: MaybeBitmap;
    public _car: BlankCar;
    

    public stage(): MaybeBitmap {
        return this._stage;
    }

    public actors(): Array<DrawableActor> {
        return [this._car];
    }

    public constructor() {
        this._stage =  get_bitmap("map.png");
        this._car = new BlankCar();
    }
}

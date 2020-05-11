import {MaybeBitmap, Point, get_bitmap, DrawableMap, DrawableActor} from "./drawer";


export class BlankCar implements DrawableActor {
    private _view: MaybeBitmap;
    public _angle : number;
    public _coords : Point;

    public view(): MaybeBitmap {
        return this._view;
    }

    public coordinates(): Point {
        return this._coords;
    }

    public angle(): number {
        return this._angle;
    }

    public constructor() {
        this._view =  get_bitmap("car.png");
        this._angle = 0;
        this._coords = { x: 500, y: 500 };
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

import { IgnorePlugin } from "webpack";
import { Point } from "base/geometry";

const MAP_WIDTH = 1000;

export class MaybeBitmap {
    public bitmap: ImageBitmap | undefined;

    constructor() {
    }

    public do(fn: (bitmap: ImageBitmap) => void): MaybeBitmap {
        if (this.bitmap != undefined)
            fn(this.bitmap as ImageBitmap);
        return this;
    }
}

// Вообще говоря, любой нефоновый персонаж, в нашем частном случае -- машинка
export interface DrawableActor {
    // Координаты центра
    readonly coordinates: Point,

    // Угол поворота с.м. pivot в рисовании на канвасе
    readonly angle: number,
    
    // Как выглядит актор
    view: () => MaybeBitmap
}

// Всё, что должно рисовать
export interface DrawableMap {
    // Фоновое изображение карты
    stage: () => MaybeBitmap,
    
    // Все акторы, в частном случае -- одна машинка
    actors: () => Array<DrawableActor>
}

//Отрисовщик, умеет рисовать DrawableMap на ваших канвасах
export class Drawer {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    private _scale: number;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        let temp_context = this._canvas.getContext('2d');
        if (temp_context != null) {
            this._context = temp_context;
        } else {
            throw "Couldn't extract context from canvas";
        }
        this._scale = this._canvas.width / MAP_WIDTH;
    }

    private draw_transform(img: ImageBitmap, coords: Point, angle: number) {
        this._context.save();
        this._context.scale(this._scale, this._scale);
        this._context.translate(coords.x, coords.y);
        this._context.rotate(angle);
        this._context.drawImage(img, -img.width/2, -img.height/2);
        this._context.restore();
    }

    public draw(map: DrawableMap) {
        map.stage().do(bm => this._context.drawImage(bm, 0, 0, this._canvas.width, this._canvas.height));
        map.actors().forEach(actor => actor.view().do(bm => this.draw_transform(bm, actor.coordinates, actor.angle)));
    }
}

export function get_bitmap(path: String, then: (btmp: ImageBitmap) => ImageBitmap = (btmp) => btmp): MaybeBitmap {
    let result = new MaybeBitmap();
    let img = new Image();
    img.onload = () => {
        createImageBitmap(img).then(bitmap => {
            result.bitmap = then(bitmap);
        })
    }
    img.src = "./resources/" + path;
    return result;
}
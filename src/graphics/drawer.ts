import {Point} from "base/geometry";

const MAP_WIDTH = 1000;

// Вообще говоря, любой нефоновый персонаж, в нашем частном случае -- машинка
export interface DrawableActor {
    // Координаты центра
    readonly coordinates: Point,

    // Угол поворота с.м. pivot в рисовании на канвасе
    readonly angle: number,

    // Как выглядит актор
    readonly view: ImageBitmap
}

// Всё, что должно рисовать
export interface DrawableMap {
    // Фоновое изображение карты
    readonly stage: ImageBitmap,

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

    public draw(map: DrawableMap) {
        this._context.drawImage(map.stage, 0, 0, this._canvas.width, this._canvas.height);
        map.actors().forEach(actor => this.draw_transform(actor.view, actor.coordinates, actor.angle));
    }

    private draw_transform(img: ImageBitmap, coords: Point, angle: number) {
        this._context.save();
        this._context.scale(this._scale, this._scale);
        this._context.translate(coords.x, coords.y);
        this._context.rotate(angle);
        this._context.drawImage(img, -img.width / 2, -img.height / 2);
        this._context.restore();
    }
}


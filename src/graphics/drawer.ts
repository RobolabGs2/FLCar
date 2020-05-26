import "./drawer.css"
import { IgnorePlugin } from "webpack";
import { Point } from "../base/geometry";

const MAP_WIDTH = 1000;

// Вообще говоря, любой нефоновый персонаж, в нашем частном случае -- машинка
export interface DrawableActor {
    // Координаты центра
    readonly coordinates: Point,

    // Угол поворота с.м. pivot в рисовании на канвасе
    readonly angle: number,

    // Как выглядит актор
    readonly view: ImageBitmap

    // Как актор видит мир
    readonly sensors: Array<DrawableSensor>

    // Цель актора
    readonly target: DrawableTargetSensor;
}

export interface DrawableSensor {
    //  Дальность измерения датчика
    readonly distance: number;

    //  Угол поворота относительно машинки
    readonly angle: number;

    //  Значение сенсора - расстояние до препятствия
    readonly value: number;
}

export interface DrawableTargetSensor {
    // Угол относительно машинки
    readonly  angle: number;

    // Расстояние до цели
    readonly distance: number;

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
        map.actors().forEach(actor => {
            this.draw_transform(actor.view, actor.coordinates, actor.angle);
            actor.sensors.forEach(sensor =>
                this.in_transform(actor.coordinates, actor.angle + sensor.angle, (context) => {
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(0, sensor.distance);
                    context.stroke();
                    context.fillStyle = "red";
                    context.fillRect(-5, sensor.value - 5, 10, 10);
                }))
            this.in_transform(actor.coordinates, actor.angle + actor.target.angle, (context) => {
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(0, actor.target.distance);
                context.stroke();
            });
        });
    }

    private draw_transform(img: ImageBitmap, coords: Point, angle: number) {
        this.in_transform(coords, angle, (context) => context.drawImage(img, -img.width / 2, -img.height / 2));
    }

    private in_transform(coords: Point, angle: number, action: (context: CanvasRenderingContext2D) => void) {
        this._context.save();
        this._context.scale(this._scale, this._scale);
        this._context.translate(coords.x, coords.y);
        this._context.rotate(angle);
        action(this._context);
        this._context.restore();
    }
}


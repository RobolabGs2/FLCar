import { evaluateSpeed } from "./logic_methods";

export interface LogicActor{
    // Фактическая скорость
    readonly speed: number;
    // Скорость, до которой надо бы разогнаться
    necessary_speed: number;
    // угол поворота колёс
    wheel_angle: number;
    // Массив сенсоров
    sensors: Array<LogicSensor>;
    //  Сенсор направления на цель
    target: LogicTargetSensor;
}

export interface LogicSensor{
    //  Дальность измерения датчика
    readonly distance: number;
    //  Угол поворота относительно машинки
    readonly angle: number;
    //  Значение сенсора - расстояние до препятствия
    readonly value: number;
}

export interface LogicTargetSensor{
    //  угол направления на цель в радианах
    readonly angle: number;
    //  расстояние до цели, в попугаях
    readonly distance: number;
}

export interface LogicMap{
    // Все акторы
    actors(): Array<LogicActor>;
}

export class Logic{
    private _map: LogicMap;

    constructor(map: LogicMap) {
        this._map = map;
        evaluateSpeed(100);
    }

    tick(dt: number){
        this._map.actors().forEach(actor => {
            var desired_angle = actor.target.angle;
            // console.log(evaluateSpeed(actor.sensors[1].value));
            // console.log(desired_angle);
            if (actor.target.distance < 50)
                actor.necessary_speed = 10;
            else
                actor.necessary_speed = actor.sensors[1].value < 30 ? -50: 50;
            actor.wheel_angle = actor.target.angle / 2;
            // actor.wheel_angle = actor.speed < 0 ? 0.01 : actor.target.angle / 50;
            // actor.wheel_angle = desired_angle;
        })
    }
}
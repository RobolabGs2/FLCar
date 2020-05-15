
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
    }

    tick(dt: number){
        this._map.actors().forEach(actor => {
            //  тут надо управлять машинкой
            actor.necessary_speed = actor.sensors[0].value < 70 ? -50: 50;
            actor.wheel_angle = actor.speed < 0 ? 0.01 : actor.target.angle / 50;
        })
    }
}
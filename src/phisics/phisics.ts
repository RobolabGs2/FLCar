
import { Point } from "base/geometry";

export interface PhisicsActor{
    // Координаты центра
    coordinates: Point;

    // Угол поворота
    angle: number;

    // Фактическая скорость
    speed: number;

    // Скорость, до которой надо бы разогнаться
    readonly necessary_speed: number;

    // угол поворота колёс
    wheel_angle: number;
}

export interface PhisicsMap{
    // Возвращает true если в данной точке есть препятствие
    is_barrier(p: Point): boolean;
    
    // Все акторы
    actors(): Array<PhisicsActor>;
}


export class PhisicsContext{
    private _map: PhisicsMap;

    constructor(map: PhisicsMap){
        this._map = map;
    }

    tick(dt: number){
        const actors = this._map.actors();
        for(let i = 0; i < actors.length; ++i){
            // var actor = actor[i];
        }

    }
}

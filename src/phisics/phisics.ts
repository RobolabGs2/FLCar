
import { Point } from "../base/geometry";

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

    // высота картинки
    readonly height: number;

    // ширина картинки
    readonly width: number;
    
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

    private line_x(p0: Point, p1: Point, y: number){
        return (y - p0.y) * (p1.x - p0.x) / (p1.y - p0.y) + p0.y;
    }

    tick(dt: number){
        let actors = this._map.actors();
        for(let i = 0; i < actors.length; ++i){
            let actor = actors[i];

            let a = actor.width / 2;
            let b = actor.height / 2;
            //  подобие матрицы поворота
            let sin_a = Math.sin(actor.angle);
            let cos_a = Math.cos(actor.angle);
            //  хардкодим перемножение матриц
            let A1 = a * cos_a + b * sin_a;
            let A2 = a * cos_a - b * sin_a;
            let B1 = -a * sin_a + b * cos_a;
            let B2 = -a * sin_a - b * cos_a;
            //  точки прямоугольника
            let points = [
                new Point(A1, B1),
                new Point(A2, B2),
                new Point(-A1, -B1),
                new Point(-A2, -B2),
            ]
            //  сортируем точки по часовой стрелки от верхней
            let max = points[0].x;
            let num = 0;
            for(let j = 1; j < 4; ++j)
                if(points[j].x > max)
                {
                    max = points[j].x;
                    num = j;
                }
            // точки, с правильным взаимным расположением и сдвигом
            let p_up    = points[num].add(actor.coordinates);
            let p_right = points[(num + 1) % 4].add(actor.coordinates);
            let p_down  = points[(num + 2) % 4].add(actor.coordinates);
            let p_left  = points[(num + 3) % 4].add(actor.coordinates);

            //  Собственно, циклик проверки коллизий
            for(let y = Math.round(p_up.y); y < p_down.y; ++y)
            {
                let start = Math.max(this.line_x(p_down, p_left, y), this.line_x(p_left, p_up, y));
                let finish = Math.min(this.line_x(p_down, p_right, y), this.line_x(p_right, p_up, y));
                for(let x = start; x < finish; ++x)
                    if(this._map.is_barrier(new Point(x, y)))
                    {
                        console.log("collision!!");
                        break;
                    }
            }
        }

    }
}

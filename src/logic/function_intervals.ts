const pi = Math.PI;

export class FunctionIntervals {
  distance: number[];
  angle: number[];
  target_dist: number[];
  speed: number[];
  turn: number[];
  //Dependence number for converting distances, defines 'far'

  static validate_input_values(turn_range: number, sensors_dst: number, max_speed: number){
    return sensors_dst >= turn_range*7 && max_speed > 0;
  }

  constructor(turn_range : number, max_speed: number) {
    const range = turn_range*7;
    //               |______   _____   _____   ____
    //               |      \ /     \ /     \ /
    //               |       ╳       ╳       ╳
    //               |      / \     / \     / \
    //               0__1  2   3   4   5   6   7
    this.distance = [0, 0, 20, 27, 35, 40, 45, 95, Infinity, Infinity];


    //              ____               ____
    //                  \  / \ | / \  /
    //                   \/   \|/   \/
    //                   /\   /|\   /\
    //                  /  \ / | \ /  \
    //             01  2   3_4   5_6   7  89
    this.angle = [-pi,-pi, -3*pi/4, -pi/4, -pi/4, pi/4, pi/4, 3*pi/4, pi, pi]

    //                  |______   _______
    //                  |      \ /
    //                  |       ╳
    //                  |      / \
    //                  0__1  2   3
    this.target_dist = [0, 0, 200, 300, Infinity, Infinity]

    //             |     ____   _____   _____
    //             |\   /    \ /     \ /
    //             |  ╳       ╳       ╳
    //             |/   \    / \     / \
    //            01    3  4   5   6   7
    this.speed = [0,0,0, 15, 18, 20, max_speed*(4/6), max_speed*(5/6), max_speed*(6/6), max_speed*(6/6)]

    //              ____               ____
    //                  \  / \ | / \  /
    //                   \/   \|/   \/
    //                   /\   /|\   /\
    //                  /  \ / | \ /  \
    //             01  2   3_4   5_6   7  89
    this.turn =  [-4*pi/4, -4*pi/4, -4*pi/4, -pi/4, pi/4, pi/4, pi/4, 4*pi/4, 4*pi/4, 4*pi/4]
  }
}

//pass  радиус поворота
export var FI : FunctionIntervals;
FI = new FunctionIntervals(15, 100); // Можно поменять место инициализации


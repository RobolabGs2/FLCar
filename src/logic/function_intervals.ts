const pi = Math.PI;

export class FunctionIntervals {
  distance: number[];
  angle: number[];
  target_dist: number[];
  speed: number[];
  turn: number[];
  //Dependence number for converting distances, defines 'far'

  public validate_input_values(turn_range: number, sensors_dst: number, max_speed: number){
    return sensors_dst >= turn_range*7 && max_speed > 0;
  }

  constructor(turn_range : number, max_speed: number) {
    const range = turn_range*7;
    //               |______   _____   _____   ____
    //               |      \ /     \ /     \ /
    //               |       ╳       ╳       ╳
    //               |      / \     / \     / \
    //               0__1  2   3   4   5   6   7
    this.distance = [0, 0, range*(2/7), range*(3/7), range*(4/7), range*(5/7), range*(6/7), range, Infinity, Infinity];


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
    this.target_dist = [0, 0, 30, 50, Infinity, Infinity]

    //             |     ____   _____   _____
    //             |\   /    \ /     \ /
    //             |  ╳       ╳       ╳
    //             |/   \    / \     / \
    //            012    3  4   5   6   7
    this.speed = [0,0,0, max_speed*(1/6), max_speed*(2/6), max_speed*(3/6), max_speed*(4/6), max_speed*(5/6), max_speed*(6/6), max_speed*(6/6)]

    //              ____               ____
    //                  \  / \ | / \  /
    //                   \/   \|/   \/
    //                   /\   /|\   /\
    //                  /  \ / | \ /  \
    //             01  2   3_4   5_6   7  89
    this.turn =  [-3*pi/12, -3*pi/12, -3*pi/12, -pi/12, pi/12, pi/12, pi/12, 3*pi/12, 3*pi/12, 3*pi/12]
  }
}

//pass  радиус поворота
export var FI : FunctionIntervals;
FI = new FunctionIntervals(15, 18); // Можно поменять место инициализации


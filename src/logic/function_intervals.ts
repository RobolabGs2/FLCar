const pi = Math.PI;

export class FunctionIntervals {
  distance: number[];
  angle: number[];
  target_dist: number[];
  speed: number[];
  turn: number[];
  //Dependence number for converting distances, defines 'far' dist
  range = 100;

  constructor() {
    //               |______   _____   _____   ____
    //               |      \ /     \ /     \ /
    //               |       ╳       ╳       ╳
    //               |      / \     / \     / \
    //               0__1  2   3   4   5   6   7
    this.distance = [0, 0, this.range*(1/6), this.range*(2/6), this.range*(3/6), this.range*(4/6), this.range*(5/6), this.range, Infinity, Infinity];


    //              ____               ____
    //                  \  / \ | / \  /
    //                   \/   \|/   \/
    //                   /\   /|\   /\
    //                  /  \ / | \ /  \
    //             01  2   3_4   5_6   7  89
    this.angle = [-pi,-pi, -3*pi/4, -pi/4, pi/4, pi/4, pi/4, 3*pi/4, pi, pi]

    //                |______   _______
    //                |      \ /
    //                |       ╳
    //                |      / \
    //                0__1  2   3
    this.target_dist = [0, 0, 30, 50, Infinity, Infinity]

    //             |     ____   _____   _____
    //             |\   /    \ /     \ /
    //             |  ╳       ╳       ╳
    //             |/   \    / \     / \
    //            012    3  4   5   6   7
    this.speed = [0,0,0, 10, 20, 30, 40, 50, 60, 60]

    //              ____               ____
    //                  \  / \ | / \  /
    //                   \/   \|/   \/
    //                   /\   /|\   /\
    //                  /  \ / | \ /  \
    //             01  2   3_4   5_6   7  89
    this.turn =  [-3*pi/12, -3*pi/12, -3*pi/12, -pi/12, pi/12, pi/12, pi/12, 3*pi/12, 3*pi/12, 3*pi/12]
  }
}

export var FI = new FunctionIntervals(); // Можно поменять место инициализации


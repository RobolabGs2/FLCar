import {FuzzyOutParam, FuzzySensor, InParam as InP, OutParam as OutP} from "./logic_methods";
import { Logic } from "./logic";

export class LogicRule {
  private antecedent: (number | null)[];
  private consequent:OutP;

  constructor(antecedent: (number | null)[], consequent:OutP) {
      if (antecedent.length > 7)
          throw "INCORRECT ANTECEDENT IN RULE";
      this.antecedent = antecedent;
      for (let i = 0; i < 7 - antecedent.length; i++)
        this.antecedent.push(null);
      this.consequent = consequent;
  }

  apply(inputs: FuzzySensor[]) : FuzzyOutParam | null {
      let result = 1;
      for (let i = 0; i < 7; i++) {
          if (this.antecedent[i] == null)
              continue;
          let mask = this.antecedent[i];
          let temp = inputs[i].values.find(x => (x.distance & mask!) != 0);
          if (temp === undefined)
              return null;
          if (temp.value < result)
              result = temp.value;
      }
      return {
          param: this.consequent,
          value: result
      };
  }
}

export const LOGIC_RULES: LogicRule[] = [








    // Speed rules - obstacles
    new LogicRule([], OutP.Slow),

    // *** Obstacles turn rules
    // If something on left -> turn right
    new LogicRule([null, InP.Medium, InP.Medium, InP.Far], OutP.Right),
    new LogicRule([null, InP.Close, InP.Close, InP.Far], OutP.StrongRight),
    new LogicRule([null, InP.VeryClose, null, null], OutP.StrongRight),
    // If something on right -> turn left
    new LogicRule([null, InP.Far, InP.Medium, InP.Medium], OutP.Left),
    new LogicRule([null, InP.Far, InP.Close, InP.Close], OutP.StrongLeft),
    new LogicRule([null, null, null, InP.VeryClose], OutP.StrongLeft),

    // *** Targeting
    // If Target on left && Free ahead -> turn left
    new LogicRule([null, InP.Far, InP.Far, null, InP.TLeft], OutP.StrongLeft),
    new LogicRule([null, InP.Far, InP.Medium, null, InP.TLeft], OutP.Left),
    // If Target on right && Free ahed -> turn right
    new LogicRule([null, null, InP.Far, InP.Far, InP.TRight], OutP.StrongRight),
    new LogicRule([null, null, InP.Medium, InP.Far, InP.TRight], OutP.Right),

    // *** Trap solution
    // Prioritizing LEFT when obstacle ONLY on front
    new LogicRule([null, InP.Far, InP.Medium, InP.Far], OutP.Left),
    new LogicRule([null, InP.Far, InP.Close, InP.Far], OutP.StrongLeft),
    new LogicRule([null, InP.Far, InP.VeryClose, InP.Far], OutP.StrongLeft),



//   new LogicRule([null, InP.Far, null, null, null],OutP.Fast),
//   new LogicRule([null, InP.Medium, null, null, null],OutP.Medium),
//   new LogicRule([null, InP.Close, null, null, null],OutP.Slow),
//   new LogicRule([null, InP.VeryClose, null, null, null],OutP.VerySlow),

//   //Turn rules - obstacles on the right
//   //first 4 rules - case obstacle is on the right, but nothing in front
//   new LogicRule([null, InP.Far, InP.Close, null, null],OutP.Left),
//   new LogicRule([null, InP.Medium, InP.Close, null, null],OutP.Left),
//   new LogicRule([null, InP.Far, InP.VeryClose, null, null],OutP.StrongLeft),
//   new LogicRule([null, InP.Medium, InP.VeryClose, null, null],OutP.StrongLeft),
//   new LogicRule([InP.Far, InP.Medium, InP.Medium, null, null],OutP.Left),
//   //these 6 rules - case obstacle is on the right, but angle between us and it is about 45 deg
//   new LogicRule([InP.Far,InP.Close,InP.Close], OutP.Left),
//   new LogicRule([InP.Far,InP.Close,InP.VeryClose], OutP.StrongLeft),
//   new LogicRule([InP.Medium,InP.Close,InP.VeryClose], OutP.StrongLeft),
//   new LogicRule([InP.Far,InP.VeryClose,InP.VeryClose], OutP.StrongLeft),
//   new LogicRule([InP.Medium,InP.VeryClose,InP.VeryClose], OutP.StrongLeft),

//   //Turn rules - obstacles in front
//   new LogicRule([InP.Medium, InP.Close, InP.Medium, null, null], OutP.Left),
//   new LogicRule([InP.Close, null, InP.Close, null, null], OutP.Left),
//   new LogicRule([InP.VeryClose, null, InP.VeryClose, null, null], OutP.StrongLeft),

//   //Turn rules - obstacles on the left
//   //first 4 rules - case obstacle is on the left, but nothing in front
//   new LogicRule([InP.Close, InP.Far, null, null, null],OutP.Right),
//   new LogicRule([InP.Close, InP.Medium, null, null, null],OutP.Right),
//   new LogicRule([InP.VeryClose, InP.Far, null, null, null],OutP.StrongRight),
//   new LogicRule([InP.VeryClose, InP.Medium, null, null, null],OutP.StrongRight),
//   //these 6 rules - case obstacle is on the left, but angle between us and it is about 45 deg
//   new LogicRule([InP.Medium, InP.Medium, InP.Far, null, null],OutP.Right),
//   new LogicRule([InP.Close, InP.Close, InP.Far, null, null],OutP.Right),
//   new LogicRule([InP.VeryClose, InP.Close, InP.Far, null, null],OutP.StrongRight),
//   new LogicRule([InP.VeryClose, InP.Close, InP.Medium, null, null],OutP.StrongRight),
//   new LogicRule([InP.VeryClose, InP.VeryClose, InP.Medium, null, null],OutP.StrongRight),
//   new LogicRule([InP.VeryClose, InP.VeryClose, InP.Far, null, null],OutP.StrongRight),

//   //Turn rules - targeting
//   new LogicRule([InP.Far, InP.Far, InP.Far, InP.TLeft, null],OutP.Left),
//   new LogicRule([InP.Far, InP.Far, InP.Medium, InP.TLeft, null],OutP.Left),
//   new LogicRule([InP.Far, InP.Far, InP.Far, InP.TStrongLeft, null],OutP.StrongLeft),
//   new LogicRule([InP.Far, InP.Far, InP.Far, InP.TRight, null],OutP.Right),
//   new LogicRule([InP.Medium, InP.Far, InP.Far, InP.TRight, null],OutP.Right),
//   new LogicRule([InP.Far, InP.Far, InP.Far, InP.TStrongRight, null],OutP.StrongRight),

//   //Speed rules - targeting
//   new LogicRule([null, null, null, null, InP.TClose], OutP.VerySlow),
];
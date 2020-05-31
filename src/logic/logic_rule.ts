import {FuzzyOutParam, FuzzySensor, InParam as InP, OutParam as OutP} from "./logic_methods";
import { Logic } from "./logic";

export class LogicRule {
  private antecedent: (number | null)[];
  private consequent: OutP;

  constructor(antecedent: (number | null)[], consequent: OutP) {
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
          let mask = this.antecedent[i]!;
          let temp = inputs[i].values.filter(x => (x.distance & mask) != 0);
          if (temp.length == 0)
              return null;
          let max = Math.max(...temp.map(x => x.value))
          if (max < result)
              result = max;
      }
    //   console.log(result);
      return {
          param: this.consequent,
          value: result
      };
  }
}

export var LOGIC_RULES: LogicRule[] = [
    // Speed rules - obstacles
    new LogicRule([], OutP.Slow),

    // *** Obstacles turn rules
    // If something on left -> turn right
    new LogicRule([null, InP.Medium,     InP.Medium, InP.Far,        null], OutP.Right),
    new LogicRule([null, InP.Close,      InP.Close,  ge(InP.Medium), null], OutP.Right),
    new LogicRule([null, InP.VeryClose,  null,       ge(InP.Close),  null], OutP.StrongRight),

    // If something on right -> turn left
    new LogicRule([null, InP.Far,        InP.Medium, InP.Medium], OutP.Left),
    new LogicRule([null, ge(InP.Medium), InP.Close,  InP.Close],  OutP.Left),
    new LogicRule([null, ge(InP.Close),  null,       InP.VeryClose], OutP.StrongLeft),

    // *** Targeting
    // Поворот срабатывает в сложных ситуация (надо ужесточить правила)
    // If Target on left && Free ahead -> turn left
    new LogicRule([null, InP.Far, ge(InP.Far),    null, ge(InP.Close), InP.TStrongLeft], OutP.StrongLeft),
    new LogicRule([null, InP.Far, ge(InP.Medium), null, ge(InP.Close), InP.TLeft], OutP.Left),
    // If Target on right && Free ahed -> turn right
    new LogicRule([ge(InP.Close), null, ge(InP.Far),    InP.Far, null, InP.TStrongRight], OutP.StrongRight),
    new LogicRule([ge(InP.Close), null, ge(InP.Medium), InP.Far, null, InP.TRight], OutP.Right),

    // *** Trap solution
    // Prioritizing LEFT when obstacle ONLY on front
    new LogicRule([null, InP.Far, le(InP.Medium),    InP.Far], OutP.Left),
    // new LogicRule([null, InP.Far, InP.Close,     InP.Far], OutP.StrongLeft),
    // new LogicRule([null, InP.Far, InP.VeryClose, InP.Far], OutP.StrongLeft),

    new LogicRule([null, InP.VeryClose, null, InP.VeryClose], OutP.StrongLeft),

    new LogicRule([InP.Medium,    InP.Far, null, InP.Far, null], OutP.Left),
    new LogicRule([le(InP.Close), InP.Far, null, InP.Far, null], OutP.StrongLeft),
    new LogicRule([null,          InP.Far, null, InP.Far, InP.Medium], OutP.Right),
    new LogicRule([null,          InP.Far, null, InP.Far, le(InP.Close)], OutP.StrongRight),


    // Слишком отдаляется при попытке отлипания
    // Antistick rules
    // new LogicRule([le(InP.VeryClose),  ge(InP.Close), null, null,          ge(InP.Medium)], OutP.StrongRight),
    // new LogicRule([ge(InP.Medium), null,          null, ge(InP.Close), le(InP.VeryClose)], OutP.StrongLeft),
]

// Greater or equal
function ge(param: InP) : number {
    return 1024 - param
}

// Lesser or equal
function le(param: InP) : number {
    return (param << 1) - 1
}


import {FuzzyOutParam, FuzzySensor, InParam as IP, OutParam} from "./logic_methods";

export class LogicRule {
  private antecedent: (IP | null)[];
  private consequent: OutParam;

  constructor(antecedent: (IP | null)[], consequent: OutParam) {
      if (antecedent.length > 5)
          throw "INCORRECT ANTECEDENT IN RULE";
      this.antecedent = antecedent;
      for (let i = 0; i < 5 - antecedent.length; i++)
        this.antecedent.push(null);
      this.consequent = consequent;
  }

  apply(inputs: FuzzySensor[]) : FuzzyOutParam | null {
      let result = 1;
      for (let i = 0; i < 5; i++) {
          if (this.antecedent[i] == null)
              continue;
          let temp = inputs[i].values.find(x => x.distance == this.antecedent[i]);
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
  //Speed rules - obstacles
  new LogicRule([null, IP.Far, null, null, null], OutParam.Fast),
  new LogicRule([null, IP.Medium, null, null, null], OutParam.Medium),
  new LogicRule([null, IP.Close, null, null, null], OutParam.Slow),
  new LogicRule([null, IP.VeryClose, null, null, null], OutParam.VerySlow),

  //Turn rules - obstacles on the right
  //first 4 rules - case obstacle is on the right, but nothing in front
  new LogicRule([null, IP.Far, IP.Close, null, null], OutParam.Left),
  new LogicRule([null, IP.Medium, IP.Close, null, null], OutParam.Left),
  new LogicRule([null, IP.Far, IP.VeryClose, null, null], OutParam.StrongLeft),
  new LogicRule([null, IP.Medium, IP.VeryClose, null, null], OutParam.StrongLeft),
  new LogicRule([IP.Far, IP.Medium, IP.Medium, null, null], OutParam.Left),
  //these 6 rules - case obstacle is on the right, but angle between us and it is about 45 deg
  new LogicRule([IP.Far,IP.Close,IP.Close],OutParam.Left),
  new LogicRule([IP.Far,IP.Close,IP.VeryClose],OutParam.StrongLeft),
  new LogicRule([IP.Medium,IP.Close,IP.VeryClose],OutParam.StrongLeft),
  new LogicRule([IP.Far,IP.VeryClose,IP.VeryClose],OutParam.StrongLeft),
  new LogicRule([IP.Medium,IP.VeryClose,IP.VeryClose],OutParam.StrongLeft),

  //Turn rules - obstacles in front
  new LogicRule([IP.Medium, IP.Close, IP.Medium, null, null],OutParam.Left),
  new LogicRule([IP.Close, null, IP.Close, null, null],OutParam.Left),
  new LogicRule([IP.VeryClose, null, IP.VeryClose, null, null],OutParam.StrongLeft),

  //Turn rules - obstacles on the left
  //first 4 rules - case obstacle is on the left, but nothing in front
  new LogicRule([IP.Close, IP.Far, null, null, null], OutParam.Right),
  new LogicRule([IP.Close, IP.Medium, null, null, null], OutParam.Right),
  new LogicRule([IP.VeryClose, IP.Far, null, null, null], OutParam.StrongRight),
  new LogicRule([IP.VeryClose, IP.Medium, null, null, null], OutParam.StrongRight),
  //these 6 rules - case obstacle is on the left, but angle between us and it is about 45 deg
  new LogicRule([IP.Medium, IP.Medium, IP.Far, null, null], OutParam.Right),
  new LogicRule([IP.Close, IP.Close, IP.Far, null, null], OutParam.Right),
  new LogicRule([IP.VeryClose, IP.Close, IP.Far, null, null], OutParam.StrongRight),
  new LogicRule([IP.VeryClose, IP.Close, IP.Medium, null, null], OutParam.StrongRight),
  new LogicRule([IP.VeryClose, IP.VeryClose, IP.Medium, null, null], OutParam.StrongRight),
  new LogicRule([IP.VeryClose, IP.VeryClose, IP.Far, null, null], OutParam.StrongRight),

  //Turn rules - targeting
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TLeft, null], OutParam.Left),
  new LogicRule([IP.Far, IP.Far, IP.Medium, IP.TLeft, null], OutParam.Left),
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TStrongLeft, null], OutParam.StrongLeft),
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TRight, null], OutParam.Right),
  new LogicRule([IP.Medium, IP.Far, IP.Far, IP.TRight, null], OutParam.Right),
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TStrongRight, null], OutParam.StrongRight),

  //Speed rules - targeting
  new LogicRule([null, null, null, null, IP.TClose],OutParam.VerySlow),
];
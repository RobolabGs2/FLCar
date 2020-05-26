import {FuzzyOutParam, FuzzySensor, IP as IP, OutParam} from "./logic_methods";

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
  new LogicRule([null, null, IP.Close], OutParam.Left),
  new LogicRule([null, null, IP.VeryClose], OutParam.StrongLeft),
  new LogicRule([IP.Far, IP.Medium, IP.Medium], OutParam.Left),
  new LogicRule([IP.Medium, IP.Close, IP.Close], OutParam.StrongLeft),

  //Turn rules - obstacles on the left
  new LogicRule([IP.Close, null, null], OutParam.Right),
  new LogicRule([IP.VeryClose, null, null], OutParam.StrongRight),
  new LogicRule([IP.Medium, IP.Medium, IP.Far], OutParam.Right),
  new LogicRule([IP.Close, IP.Close, IP.Medium], OutParam.StrongRight),

  //Turn rules - targeting
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TLeft, IP.TFar], OutParam.Left),
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TStrongLeft, IP.TFar], OutParam.StrongLeft),
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TRight, IP.TFar], OutParam.Right),
  new LogicRule([IP.Far, IP.Far, IP.Far, IP.TStrongRight, IP.TFar], OutParam.StrongRight),

  //Speed rules - targeting
  new LogicRule([IP.TStrongRight, IP.TStrongLeft, IP.TClose],OutParam.VerySlow),
  new LogicRule([IP.TStrongRight, IP.TStrongLeft, IP.TClose],OutParam.VerySlow),
];
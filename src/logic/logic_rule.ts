import { InDistance, OutParam, FuzzySensor, FuzzyOutParam } from "./logic_methods";

export class LogicRule {
  private antecedent: (InDistance | null)[];
  private consequent: OutParam;

  constructor(antecedent: (InDistance | null)[], consequent: OutParam) {
      if (antecedent.length != 3)
          throw "INCORRECT ANTECEDENT IN RULE";
      this.antecedent = antecedent;
      this.consequent = consequent;
  }

  apply(inputs: FuzzySensor[]) : FuzzyOutParam | null {
      let result = 1;
      for (let i = 0; i < 3; i++) {
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
  new LogicRule([null, InDistance.Far, null], OutParam.Fast),
  new LogicRule([null, InDistance.Medium, null], OutParam.Medium),
  new LogicRule([null, InDistance.Close, null], OutParam.Slow),
  new LogicRule([null, InDistance.VeryClose, null], OutParam.VerySlow),

  new LogicRule([null, null, InDistance.Close], OutParam.Left),
  new LogicRule([InDistance.Far, InDistance.Medium, InDistance.Medium], OutParam.Left),
  new LogicRule([InDistance.Medium, InDistance.Close, InDistance.Close], OutParam.StrongLeft),
  new LogicRule([InDistance.Close, InDistance.VeryClose, InDistance.VeryClose], OutParam.StrongLeft),

  new LogicRule([InDistance.Close, null, null], OutParam.Right),
  new LogicRule([InDistance.Medium, InDistance.Medium, InDistance.Far], OutParam.Right),
  new LogicRule([InDistance.Close, InDistance.Close, InDistance.Medium], OutParam.StrongRight),
  new LogicRule([InDistance.VeryClose, InDistance.VeryClose, InDistance.Close], OutParam.StrongRight),
];
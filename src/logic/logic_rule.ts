import { InParam, OutParam, FuzzySensor, FuzzyOutParam } from "./logic_methods";

export class LogicRule {
  private antecedent: (InParam | null)[];
  private consequent: OutParam;

  constructor(antecedent: (InParam | null)[], consequent: OutParam) {
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
  //Speed rules
  new LogicRule([null, InParam.Far, null, null, null], OutParam.Fast),
  new LogicRule([null, InParam.Medium, null, null, null], OutParam.Medium),
  new LogicRule([null, InParam.Close, null, null, null], OutParam.Slow),
  new LogicRule([null, InParam.VeryClose, null, null, null], OutParam.VerySlow),

  //Turn rules - obstacles on the right
  new LogicRule([null, null, InParam.Close], OutParam.Left),
  new LogicRule([null, null, InParam.VeryClose], OutParam.StrongLeft),
  new LogicRule([InParam.Far, InParam.Medium, InParam.Medium], OutParam.Left),
  new LogicRule([InParam.Medium, InParam.Close, InParam.Close], OutParam.StrongLeft),

  //Turn rules - obstacles on the left
  new LogicRule([InParam.Close, null, null], OutParam.Right),
  new LogicRule([InParam.VeryClose, null, null], OutParam.StrongRight),
  new LogicRule([InParam.Medium, InParam.Medium, InParam.Far], OutParam.Right),
  new LogicRule([InParam.Close, InParam.Close, InParam.Medium], OutParam.StrongRight),
];
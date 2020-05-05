import { Container, Types } from "src/ioc/ioc";
import ISum from '../ISum';
import Sum2 from "../Sum2";

Container.bind(Types.Sum, Sum2);
const sum = Container.get<ISum>(Types.Sum)

describe("sum", () => {
  it("sums two numbers", () => {
    expect(sum.do(1, 2)).toEqual(4);
  });
});
import { injectable } from "src/ioc/ioc";
import ISum from "./ISum";

@injectable()
export default class Sum2 implements ISum {
  public do(a: number, b: number): number {
    return a + b + 1;
  }
}
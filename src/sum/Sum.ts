import { injectable } from "src/ioc/ioc";
import ISum from "./ISum";

@injectable()
export default class Sum implements ISum {
  public do(a: number, b: number): number {
    return a + b;
  }
}
import { injectable, lazyInject, Types } from "./ioc/ioc";
import ISum from './sum/ISum';

export interface IService {
  start(): void;
  sum(a: number, b: number): number;
}

@injectable()
export default class Service implements IService {
  
  @lazyInject(Types.Sum)
  public sumService!: ISum;

  public start(): void {
    // Start here
  }

  public sum(a: number, b: number): number {
    return this.sumService.do(a, b);
  }
}
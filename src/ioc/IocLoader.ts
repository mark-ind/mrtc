import "reflect-metadata";
import { Types } from './types';
import { IService } from 'src/Service';
import Sum from 'src/sum/Sum';
import ISum from "src/sum/ISum";
import Container from 'src/ioc/Container';

export default class IocLoader {

  public static load(optinos: {}): void {
    this.bindDefaults();
    // Now here bind according options
  }

  private static bindDefaults(): void {
    Container.bind<IService>(Types.Service, require('src/Service').default);
    Container.bind<ISum>(Types.Sum, Sum);
  }
}
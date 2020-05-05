import { Container, IocLoader, Types } from "src/ioc/ioc";
import { IService } from './Service';

export default class Factory {

  public static build(options: {}): IService {
    IocLoader.load(options);

    return Container.get<IService>(Types.Service);
  }
}
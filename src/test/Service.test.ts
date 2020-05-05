import { Container, IocLoader, Types } from "src/ioc/ioc";
import { IService } from '../Service';

IocLoader.load({});
const service = Container.get<IService>(Types.Service)

describe("service", () => {
  it("sums two numbers", () => {
    expect(service.sum(1, 2)).toEqual(3);
  });
});
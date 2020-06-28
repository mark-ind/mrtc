import { Container as InversifyContainer } from "inversify";

const container = new InversifyContainer();

export default class Container {

  public static getInversifyContainer(): InversifyContainer {
    return container;
  }

  public static get<T>(serviceIdentifier: symbol): T {
    return container.get<T>(serviceIdentifier);
  }

  public static bind<T>(serviceId: symbol, constructor: { new(...args: any[]): T }): void {
    if (container.isBound(serviceId)) container.rebind<T>(serviceId).to(constructor);
    else container.bind<T>(serviceId).to(constructor);
  }

  public static bindWithArgs<T>(serviceId: symbol,
    constructor: { new(...args: any[]): T },
    args: any): void {
    if (container.isBound(serviceId))
      container.rebind<T>(serviceId).toDynamicValue(() => new constructor(args));
    else
      container.bind<T>(serviceId).toDynamicValue(() => new constructor(args));
  }

  public static bindSingleton<T>(serviceId: symbol, constructor: { new(...args: any[]): T }): void {
    if (container.isBound(serviceId))
      container.rebind<T>(serviceId).to(constructor).inSingletonScope();
    else container.bind<T>(serviceId).to(constructor).inSingletonScope();
  }
}
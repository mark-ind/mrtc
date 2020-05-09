import { Container, IocLoader, Types } from "src/ioc/ioc";
import IMrtc from "./IMrtc";
import Logger from 'src/log/Logger';

export default class MrtcFactory {

  public static build(options?: {}): IMrtc {
    const logger = Logger.getLogger(MrtcFactory.name).subLogger('build');

    logger.debug('options', options);
    IocLoader.load(options);

    return Container.get<IMrtc>(Types.Mrtc);
  }
}
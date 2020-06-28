import "reflect-metadata";
import { Types } from './types';

import Container from 'src/ioc/Container';
import PeerRtc from "src/imp/peerjs/PeerRtc";
import IFactoryOptions from "src/IFactoryOptions";

export default class IocLoader {

  public static load(optinos: IFactoryOptions): void {
    this.bindDefaults(optinos);
    // Now here bind according options
  }

  private static bindDefaults(options: IFactoryOptions): void {
    Container.bind(Types.Mrtc, PeerRtc);
  }
}
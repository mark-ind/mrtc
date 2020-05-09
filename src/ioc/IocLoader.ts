import "reflect-metadata";
import { Types } from './types';

import Container from 'src/ioc/Container';
import PeerRtc from "src/imp/peerjs/PeerRtc";

export default class IocLoader {

  public static load(optinos?: {}): void {
    this.bindDefaults();
    // Now here bind according options
  }

  private static bindDefaults(): void {
    Container.bind(Types.Mrtc, PeerRtc);
  }
}
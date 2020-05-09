import { IocLoader } from "src/ioc/ioc";
import MrtcFactory from "src/MrtcFactory";
import PeerRtc from '../imp/peerjs/PeerRtc';

IocLoader.load({});
const mrtc = MrtcFactory.build();

describe("build", () => {
  it("should return instance of PeerRtc", () => {
    expect(mrtc).toBeInstanceOf(PeerRtc);
  });
});
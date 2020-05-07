import { ISimpleEvent, IEvent, ISignal } from "strongly-typed-events";

export default interface IMrtc {
  connectServer(localId: string): Promise<boolean>;
  connectRemote(remoteId: string): Promise<IConnection>;
  disconnectServer(): Promise<boolean>;

  onRemoteConnection: ISimpleEvent<IConnection>;
  onServerDisconnected: ISignal;
}

export interface IConnection {
  shareData(data: {}): Promise<void>;
  shareScreen(options: {}): Promise<MediaStream>;
  shareAudio(options: {}): Promise<MediaStream>;
  shareWebcam(options: {}): Promise<MediaStream>;

  onData: IEvent<IConnection, {}>;
  onScreenShared: IEvent<IConnection, MediaStream>;
  onAudioShared: IEvent<IConnection, MediaStream>;
  onWebcamShared: IEvent<IConnection, MediaStream>;
  onClose: ISimpleEvent<IConnection>;
}
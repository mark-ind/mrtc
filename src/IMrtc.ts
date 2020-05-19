import { ISimpleEvent, IEvent } from "strongly-typed-events";

export default interface IMrtc {
  connectServer(localId: string, options?: {}): Promise<boolean>;
  connectRemote(remoteId: string): Promise<IConnection>;
  disconnectServer(): Promise<boolean>;

  onRemoteConnection: ISimpleEvent<IConnection>;
  onServerDisconnected: ISimpleEvent<string>;
}

export interface IConnection {
  shareData(data: {}): Promise<void>;
  shareScreen(options: {}): Promise<IMediaConnection>;
  shareAudio(options: {}): Promise<IMediaConnection>;
  shareCam(options: {}): Promise<IMediaConnection>;
  disconnect(): void;

  onData: IEvent<IConnection, {}>;
  onScreenShared: IEvent<IConnection, IMediaConnection>;
  onAudioShared: IEvent<IConnection, IMediaConnection>;
  onWebcamShared: IEvent<IConnection, IMediaConnection>;
  onDisconnected: IEvent<IConnection, string>;
}

export interface IMediaConnection {
  stream: MediaStream;
  // enabled: boolean; // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/enabled
  disconnect(): void;

  onDisconnected: IEvent<IMediaConnection, string>;
}
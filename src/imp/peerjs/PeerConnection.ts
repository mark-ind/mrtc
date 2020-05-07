import { IConnection } from "src/IMrtc";
import { IEvent, EventDispatcher, SimpleEventDispatcher, ISimpleEvent } from "strongly-typed-events";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { MetadataType } from "src/imp/MetadataType";

export default class PeerConnection implements IConnection {

  private peer: Peer;
  private connection: DataConnection;

  private screenStream!: MediaStream;
  private audioStream!: MediaStream;
  private camStream!: MediaStream;

  private _onData = new EventDispatcher<IConnection, {}>();
  private _onScreenShared = new EventDispatcher<IConnection, MediaStream>();
  private _onAudioShared = new EventDispatcher<IConnection, MediaStream>();
  private _onWebcamShared = new EventDispatcher<IConnection, MediaStream>();
  private _onClose = new SimpleEventDispatcher<IConnection>();

  public constructor(peer: Peer, connection: DataConnection) {
    this.connection = connection;
    this.peer = peer;

    connection.on('data', (data) => this._onData.dispatch(this, JSON.parse(data)));
    connection.on('close', () => this._onClose.dispatch(this));

    this.peer.on('call', (call: MediaConnection) => {
      // eslint-disable-next-line no-console
      console.log("PeerConnection -> constructor -> call", call)
      switch (call.metadata.type as MetadataType) {
        case MetadataType.screen:
          call.on('stream', remoteStream => { this._onScreenShared.dispatch(this, remoteStream) });
          break;
        case MetadataType.audio:
          call.on('stream', remoteStream => { this._onAudioShared.dispatch(this, remoteStream) });
          break;
        case MetadataType.cam:
          call.on('stream', remoteStream => { this._onWebcamShared.dispatch(this, remoteStream) });
          break;
      }
    });
  }

  public async shareData(data: {}): Promise<void> {
    this.connection.send(JSON.stringify(data));
  }

  public async shareScreen(options: {}): Promise<MediaStream> {
    const gdmOptions = {
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    }

    const metadata = { type: MetadataType.screen }

    this.screenStream = await (navigator.mediaDevices as any).getDisplayMedia(gdmOptions) as MediaStream;

    const mediaConnection = this.peer.call(this.connection.peer, this.screenStream, { metadata });
    mediaConnection.on("error", (err) => { throw err });

    return this.screenStream;
  }

  public async shareAudio(options: {}): Promise<MediaStream> {
    const metadata = { type: MetadataType.audio }

    this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaConnection = this.peer.call(this.connection.peer, this.audioStream, { metadata });
    mediaConnection.on("error", (err) => { throw err });

    return this.audioStream;
  }

  public async shareWebcam(options: {}): Promise<MediaStream> {
    const metadata = { type: MetadataType.cam }

    this.camStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const mediaConnection = this.peer.call(this.connection.peer, this.camStream, { metadata });
    mediaConnection.on("error", (err) => { throw err });

    return this.camStream;
  }

  public get onData(): IEvent<IConnection, {}> { return this._onData.asEvent() }
  public get onScreenShared(): IEvent<IConnection, MediaStream> { return this._onScreenShared.asEvent() }
  public get onAudioShared(): IEvent<IConnection, MediaStream> { return this._onAudioShared.asEvent() }
  public get onWebcamShared(): IEvent<IConnection, MediaStream> { return this._onWebcamShared.asEvent() }
  public get onClose(): ISimpleEvent<IConnection> { return this._onClose.asEvent() }

}
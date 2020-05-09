import { IConnection, IMediaConnection } from "src/IMrtc";
import { IEvent, EventDispatcher } from "strongly-typed-events";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { MetadataType } from "src/imp/MetadataType";
import { PeerMediaConnection } from './PeerMediaConnection';

export default class PeerConnection implements IConnection {
  private peer: Peer;
  private connection: DataConnection;

  private _onData = new EventDispatcher<IConnection, {}>();
  private _onScreenShared = new EventDispatcher<IConnection, IMediaConnection>();
  private _onAudioShared = new EventDispatcher<IConnection, IMediaConnection>();
  private _onWebcamShared = new EventDispatcher<IConnection, IMediaConnection>();
  private _onDisconnected = new EventDispatcher<IConnection, string>();

  public constructor(peer: Peer, connection: DataConnection) {
    this.connection = connection;
    this.peer = peer;

    connection.on('data', (data) => this._onData.dispatch(this, JSON.parse(data)));
    connection.on('close', () => this._onDisconnected.dispatch(this, 'closed'));
    connection.on('error', (error) => this._onDisconnected.dispatch(this, error));

    this.peer.on('call', this.handleMediaConnection);
  }

  public async shareData(data: {}): Promise<void> {
    this.connection.send(JSON.stringify(data));
  }

  public async shareScreen(options: {}): Promise<IMediaConnection> {
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

    const stream = await (navigator.mediaDevices as any).getDisplayMedia(gdmOptions) as MediaStream;

    const connection = this.peer.call(this.connection.peer, stream, { metadata });

    return new PeerMediaConnection(connection, stream);
  }

  public async shareAudio(options: {}): Promise<IMediaConnection> {
    const metadata = { type: MetadataType.audio }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const connection = this.peer.call(this.connection.peer, stream, { metadata });

    return new PeerMediaConnection(connection, stream);
  }

  public async shareCam(options: {}): Promise<IMediaConnection> {
    const metadata = { type: MetadataType.cam }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const connection = this.peer.call(this.connection.peer, stream, { metadata });

    return new PeerMediaConnection(connection, stream);
  }

  public disconnect(): void {
    this.connection.close();
  }

  public get onData(): IEvent<IConnection, {}> { return this._onData.asEvent() }
  public get onScreenShared(): IEvent<IConnection, IMediaConnection> {
    return this._onScreenShared.asEvent()
  }
  public get onAudioShared(): IEvent<IConnection, IMediaConnection> {
    return this._onAudioShared.asEvent()
  }
  public get onWebcamShared(): IEvent<IConnection, IMediaConnection> {
    return this._onWebcamShared.asEvent()
  }
  public get onDisconnected(): IEvent<IConnection, string> { return this._onDisconnected.asEvent() }

  private handleMediaConnection(connection: MediaConnection): void {
    switch (connection.metadata.type as MetadataType) {
      case MetadataType.screen:
        connection.on('stream', remoteStream => {
          this._onScreenShared.dispatch(this, new PeerMediaConnection(connection, remoteStream))
        });
        break;
      case MetadataType.audio:
        connection.on('stream', remoteStream => {
          this._onAudioShared.dispatch(this, new PeerMediaConnection(connection, remoteStream))
        });
        break;
      case MetadataType.cam:
        connection.on('stream', remoteStream => {
          this._onWebcamShared.dispatch(this, new PeerMediaConnection(connection, remoteStream))
        });
        break;
    }
  }
}
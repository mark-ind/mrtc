import { IConnection, IMediaConnection } from "src/IMrtc";
import { IEvent, EventDispatcher } from "strongly-typed-events";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { MetadataType } from "src/imp/MetadataType";
import { PeerMediaConnection } from './PeerMediaConnection';
import Logger from 'src/log/Logger';
import isElectron from 'is-electron';
import BrowserScreenShare from 'src/screenCapture/BrowserScreenShare';
import ElectronScreenShare from 'src/screenCapture/ElectronScreenShare';

export default class PeerConnection implements IConnection {
  private peer: Peer;
  private connection: DataConnection;
  private logger = Logger.getLogger(PeerConnection.name);

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
    this.logger.subLogger('shareData').debug(`data`, data);

    this.connection.send(JSON.stringify(data));
  }

  public async shareScreen(options: {}): Promise<IMediaConnection> {
    const logger = this.logger.subLogger('shareScreen');
    logger.info(`Is electron ${isElectron()}`)

    const metadata = { type: MetadataType.screen }
    const stream = isElectron()
      ? await ElectronScreenShare.share(options)
      : await BrowserScreenShare.share(options);

    logger.info(`Calling peer with ${this.connection.peer} and `, stream, { metadata });
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

  private handleMediaConnection = (connection: MediaConnection): void => {
    const logger = this.logger.subLogger('handleMediaConnection');

    logger.debug('Connection ', connection);
    switch (connection.metadata.type) {
      case MetadataType.screen:
        logger.debug('Registering on stream for screen capture ');
        connection.on('stream', remoteStream => {
          logger.debug('Stream arrived for screen capture ');
          this._onScreenShared.dispatch(this, new PeerMediaConnection(connection, remoteStream))
        });
        break;
      case MetadataType.audio:
        logger.debug('Stream arrived for audio ');
        connection.on('stream', remoteStream => {
          this._onAudioShared.dispatch(this, new PeerMediaConnection(connection, remoteStream))
        });
        break;
      case MetadataType.cam:
        logger.debug('Stream arrived for cam ');
        connection.on('stream', remoteStream => {
          this._onWebcamShared.dispatch(this, new PeerMediaConnection(connection, remoteStream))
        });
        break;
      default:
        logger.warn(`Unsupported meta data type ${connection.metadata.type}`)
    }

    connection.answer();
  }
}
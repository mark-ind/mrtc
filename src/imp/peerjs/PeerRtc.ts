import Peer from 'peerjs';
import { SimpleEventDispatcher, SignalDispatcher, ISimpleEvent, ISignal } from "strongly-typed-events";
import IMrtc, { IConnection } from 'src/IMrtc';
import PeerConnection from './PeerConnection';

export default class PeerRtc implements IMrtc {
  private peer!: Peer;
  private _onRemoteConnection = new SimpleEventDispatcher<IConnection>();
  private _onServerDisconnected = new SignalDispatcher();

  public connectServer(localId: string): Promise<boolean> {
    this.peer = new Peer(localId);
    this.peer.on('connection', connection => {
      this._onRemoteConnection.dispatch(new PeerConnection(this.peer, connection));
    });
    this.peer.on('disconnected', this._onServerDisconnected.dispatch);

    return Promise.resolve(true);
  }

  public connectRemote(remoteId: string): Promise<IConnection> {
    const connection = this.peer.connect(remoteId);

    return new Promise<IConnection>((resolve) => {
      connection.on('open', () => { resolve(new PeerConnection(this.peer, connection)) });
    });
  }

  public disconnectServer(): Promise<boolean> {
    this.peer.disconnect();

    return Promise.resolve(this.peer.disconnected);
  }

  public get onRemoteConnection(): ISimpleEvent<IConnection> { return this._onRemoteConnection.asEvent() }
  public get onServerDisconnected(): ISignal { return this._onServerDisconnected.asEvent() }
}

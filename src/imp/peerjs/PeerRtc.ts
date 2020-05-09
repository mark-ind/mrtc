import { injectable } from 'src/ioc/ioc';
import Peer from 'peerjs';
import { SimpleEventDispatcher, ISimpleEvent } from "strongly-typed-events";
import IMrtc, { IConnection } from 'src/IMrtc';
import PeerConnection from './PeerConnection';

@injectable()
export default class PeerRtc implements IMrtc {
  private peer!: Peer;
  private _onRemoteConnection = new SimpleEventDispatcher<IConnection>();
  private _onServerDisconnected = new SimpleEventDispatcher<string>();

  public connectServer(localId: string, options?: {}): Promise<boolean> {
    this.peer = new Peer(localId, options);

    this.peer.on('connection', connection => {
      this._onRemoteConnection.dispatch(new PeerConnection(this.peer, connection));
    });

    this.peer.on('disconnected', () => this._onServerDisconnected.dispatch('disconnected'));
    this.peer.on('error', (error) => {
      if (error.type !== 'peer-unavailable')
        this._onServerDisconnected.dispatch(error.type)
    });

    // Oscar Mercado Ministro de Trabajo
    return new Promise((resolve) => { this.peer.on('open', () => resolve(true)) });
  }

  public connectRemote(remoteId: string): Promise<IConnection> {
    const connection = this.peer.connect(remoteId);

    return new Promise<IConnection>((resolve, reject) => {
      connection.on('open', () => { resolve(new PeerConnection(this.peer, connection)) });
      this.peer.on('error', error => {
        if (error.type === 'peer-unavailable') reject('peer-unavailable')
      });
    });
  }

  public disconnectServer(): Promise<boolean> {
    this.peer.disconnect();

    return Promise.resolve(this.peer.disconnected);
  }

  public get onRemoteConnection(): ISimpleEvent<IConnection> { 
    return this._onRemoteConnection.asEvent() 
  }

  public get onServerDisconnected(): ISimpleEvent<string> { 
    return this._onServerDisconnected.asEvent() 
  }
}

import { injectable } from 'src/ioc/ioc';
import Peer from 'peerjs';
import { SimpleEventDispatcher, ISimpleEvent } from "strongly-typed-events";
import IMrtc, { IConnection } from 'src/IMrtc';
import PeerConnection from './PeerConnection';
import Logger from 'src/log/Logger';

@injectable()
export default class PeerRtc implements IMrtc {
  private peer!: Peer;
  private _onRemoteConnection = new SimpleEventDispatcher<IConnection>();
  private _onServerDisconnected = new SimpleEventDispatcher<string>();
  private logger = Logger.getLogger(PeerRtc.name);

  public connectServer(localId: string, options?: {}): Promise<boolean> {
    const logger = this.logger.subLogger('connectServer');

    logger.debug(`localId:${localId}, options`, options);
    this.peer = new Peer(localId, options);

    this.peer.on('connection', connection => {
      logger.debug(`onRemoteConnection`, connection);
      this._onRemoteConnection.dispatch(new PeerConnection(this.peer, connection));
    });

    this.peer.on('disconnected', () => {
      logger.debug(`_onServerDisconnected`);
      this._onServerDisconnected.dispatch('disconnected')
    });
    
    this.peer.on('error', (error) => {
      logger.debug(`error`, error);
      if (error.type !== 'peer-unavailable'){
        logger.debug(`_onServerDisconnected`, error.type);
        this._onServerDisconnected.dispatch(error.type)
      }
    });

    // Oscar Mercado Ministro de Trabajo
    return new Promise((resolve) => { this.peer.on('open', () => {
      logger.debug(`opened`);
      resolve(true);
    }) });
  }

  public connectRemote(remoteId: string): Promise<IConnection> {
    const connection = this.peer.connect(remoteId);

    return new Promise<IConnection>((resolve, reject) => {
      connection.on('open', () => { 
        this.logger.info(`connected to ${remoteId} successfully`, connection);
        resolve(new PeerConnection(this.peer, connection)) 
      });
      this.peer.on('error', error => {
        // if (error.type === 'peer-unavailable') reject('peer-unavailable')
        this.logger.error(`failed connection to ${remoteId}`, error);
        reject(error.type)
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

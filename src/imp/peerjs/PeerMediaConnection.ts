import { IEvent, EventDispatcher } from "strongly-typed-events";
import { IMediaConnection } from '../../IMrtc';
import { MediaConnection } from 'peerjs';

export class PeerMediaConnection implements IMediaConnection {
  public stream: MediaStream;

  private connection: MediaConnection;
  private _onDisconnected = new EventDispatcher<IMediaConnection, string>();

  public constructor(connection: MediaConnection, stream: MediaStream) {
    this.stream = stream;
    this.connection = connection;

    connection.on("error", (err) => this._onDisconnected.dispatch(this, err));
    connection.on("close", () => this._onDisconnected.dispatch(this, 'closed'));
  }

  public disconnect(): void {
    this.connection.close();
  }

  public get onDisconnected(): IEvent<IMediaConnection, string> {
    return this._onDisconnected.asEvent();
  };
}

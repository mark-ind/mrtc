# MRTC

This is just a wrapper library for PeerJs to make webrtc even easier.

## Installation

```shell
yarn add mark-ind-mrtc
```

## Usage

# Import and build

```javascript
import { MrtcFactory, IConnection } from "mrtc";

const mrtc = MrtcFactory.build();
```

# Connect to signaling server

```javascript
mrtc.connectServer("local_peer_id").then((s) => {
  mrtc.connectRemote("remote_peer_id").then((c) => {

    c.onData.sub((c, d) => console.info(`onData`, d));
    c.onScreenShared.sub((c, m) => {
      console.info(`onScreenShared`, m);
      const video = document.getElementById("video") as HTMLMediaElement;
      video.srcObject = m.stream;
    });
    c.onAudioShared.sub((c, m) => {
      console.info(`onScreenShared`, m);
      const audio = document.getElementById("audio") as HTMLMediaElement;
      audio.srcObject = m.stream;
    });
    c.onWebcamShared.sub((c, m) => {
      console.info(`onScreenShared`, m);
      const audio = document.getElementById("audio") as HTMLMediaElement;
      audio.srcObject = m.stream;
    });

    c.shareData({ message: "Hola" });
  });
});
```

# Accept a peer connection

```javascript
mrtc.onRemoteConnection.sub((c) => {
console.debug("onRemoteConnection ", c);

c.shareData({ message: "Bola" });
c.shareScreen({});
c.shareAudio({});
});

mrtc.onServerDisconnected.sub((error) =>
console.warn("onServerDisconnected", error)
);
```

# Configure logger
```javascript

import { Logger } from "mrtc";

Logger.configure({ level: "debug" });
```
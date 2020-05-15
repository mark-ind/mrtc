import Logger from 'src/log/Logger';

export default class ElectronScreenShare {
  private static logger = Logger.getLogger(ElectronScreenShare.name);
  
  public static async share(options: {}): Promise<MediaStream> {
    this.logger.info(`Options`, options);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { desktopCapturer } = require('electron');
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    const source = sources[0];

    this.logger.info(`Screen source to share`, source);
    
    const defaultOptions = {
      video: {
        // cursor: "always",
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      },
      audio: false,
      // audio: {
      //   echoCancellation: true,
      //   noiseSuppression: true,
      //   sampleRate: 44100
      // }
    }


    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await navigator.mediaDevices.getUserMedia(defaultOptions);
  }
}
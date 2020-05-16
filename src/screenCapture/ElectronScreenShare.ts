import Logger from 'src/log/Logger';

export default class ElectronScreenShare {
  private static logger = Logger.getLogger(ElectronScreenShare.name);

  public static async share(options: {}): Promise<MediaStream> {
    this.logger.info(`Options`, options);

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { desktopCapturer, remote } = require('electron');

      this.logger.info(`Displays`, remote.screen.getPrimaryDisplay());
      const sources = await desktopCapturer.getSources({ types: ['screen'] });
      const primaryDisplay = remote.screen.getPrimaryDisplay();
      const source = sources.find((s: any) => s.id.includes(primaryDisplay.id));

      this.logger.info(`Screen source to share`, source);

      const defaultConstrains = {
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id,
            minWidth: primaryDisplay.size.width,
            minHeight: primaryDisplay.size.height,
            maxFrameRate: 25
          }
        },
      }


      const audioConstrains = {
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        }
      }

      const finalConstrains = {};
      const isWin = process.platform === "win32";

      // audio does not work in mac https://www.electronjs.org/docs/api/desktop-capturer
      if (isWin)
        Object.assign(finalConstrains, defaultConstrains, audioConstrains);
      else
        Object.assign(finalConstrains, defaultConstrains);


      this.logger.debug('Requesting screen access with', finalConstrains);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return await navigator.mediaDevices.getUserMedia(finalConstrains);
    } catch (e) {
      const errorMessage = `Failed to screen share`;
      this.logger.error(errorMessage, e);
      throw e;
    }
  }
}
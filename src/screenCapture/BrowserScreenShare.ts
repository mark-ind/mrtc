export default class BrowserScreenShare {
  public static async share(options: {}): Promise<MediaStream> {
    const defaultOptions = {
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    }

    return (navigator.mediaDevices as any).getDisplayMedia(defaultOptions) as MediaStream;
  }
}
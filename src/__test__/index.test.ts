import { Logger, MrtcFactory } from 'src/index';

const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
beforeEach(() => {
  consoleSpy.mockClear();
});

describe("Logger", () => {
  it("level debug is called when using MrtcFactory", () => {
    Logger.configure({ level: 'debug' });
    MrtcFactory.build();

    expect(consoleSpy).toBeCalled();
  });

  it("level debug is not called when using MrtcFactory", () => {
    Logger.configure({ level: 'none' });
    MrtcFactory.build();

    expect(consoleSpy).not.toBeCalled();
  });
});
interface HotData {
  styleElement: HTMLStyleElement | undefined;
}

interface NodeModule {
  hot: {
    data: HotData;
    addDisposeHandler: (handler: (data: HotData) => void) => void;
  };
}

declare var module: NodeModule;

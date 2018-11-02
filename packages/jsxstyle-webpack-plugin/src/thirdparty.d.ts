declare module 'webpack/lib/node/NodeWatchFileSystem' {
  import webpack = require('webpack');
  class NodeWatchFileSystem {
    constructor(fs: webpack.InputFileSystem);
  }
  // hmmmmmmm
  interface NodeWatchFileSystem extends webpack.InputFileSystem {}
  export = NodeWatchFileSystem;
}

declare module 'webpack/lib/MemoryOutputFileSystem' {
  import MemoryFS = require('memory-fs');
  export = MemoryFS;
}

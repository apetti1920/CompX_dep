module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    index: './src/electron/index.ts',
    MainWindow: './src/app/mainWindow/renderer.tsx',
    EditBlockWindow: './src/app/editBlockWindow/renderer.tsx',
    GetBlockLibraryFiles: './src/electron/IPC/GetBlockLibraryFiles.ts',
    ModelLib: './src/shared/lib/GraphLibrary/ModelChildProcess.ts'
  },
  output: {
    path: __dirname + '/.webpack/main',
    filename: "[name].js"
  },
  module: {
    rules: require('./webpack.rules')
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
};

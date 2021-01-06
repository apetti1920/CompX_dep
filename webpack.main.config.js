module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    index: './src/electron/index.ts',
    MainWindow: './src/app/windows/mainWindow/renderer.tsx',
    GetBlockLibraryFiles: './src/shared/lib/GraphLibrary/helpers/GetBlockLibraryFilesChildProcess.ts',
    ModelLib: './src/shared/lib/GraphLibrary/helpers/ModelChildProcess.ts'
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

import Config from 'webpack-chain';

const FileManagerPlugin = require('filemanager-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {env: {NODE_ENV, bundleAnalyzer}} = process;

export default (config: Config) => {
  config.optimization.splitChunks({
    cacheGroups: {
      styles: {
        name: 'styles',
        test: /\.(css|less)$/,
        chunks: 'async',
        minChunks: 1,
        minSize: 0,
      }
    },
  });
  // 正式环境
  if (NODE_ENV === 'production') {
    // 根据查看打包之后的文件情况，优化js
    if (bundleAnalyzer) {
      config
        .plugin('BundleAnalyzerPlugin')
        .use(new BundleAnalyzerPlugin());
    }

    // build之后的文件压缩成压缩包
    config
      .plugin('FileManagerPlugin')
      .use(new FileManagerPlugin({
        onEnd: {
          archive: [
            { source: './dist', destination: 'front.zip' },
          ]
        }
      }));
  }
}

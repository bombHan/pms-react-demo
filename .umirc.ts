import { IConfig } from 'umi';
import reactOptions from './config/.umirc.react';
import theme from './config/.umirc.theme';
import proxy from './config/.umirc.proxy';
import chainWebpack from './config/.umirc.chainWebpack';
import routes from './config/.umire.routes';

const config: IConfig =  {
  hash: true,
  routes,
  theme,
  targets: {ie: 11},
  devServer: {https: false},
  proxy,
  plugins: [
    './config/.umirc.plugin.ts'
  ],
  ...reactOptions,
  manifest: {basePath: './platformConfig/',},
  publicPath: `./`,
  outputPath: '/dist/front',
  ignoreMomentLocale: true,
  title: false,
  history: {type: 'hash'},
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  dynamicImport: {},
  qiankun: {
    slave: {}
  },
  chainWebpack,
};

export default config;

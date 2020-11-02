import DotenvFlow from 'dotenv-flow-webpack';
import { config } from 'dotenv-flow';
import CompressionPlugin from 'compression-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { proxy } from './src/webapp';
import path from 'path';
config({ silent: true });

// env file 注入到前端
const definitions = new DotenvFlow().definitions;
for (const key in definitions) {
  definitions[key] = definitions[key].replace(/^"/, '').replace(/"$/, '');
}

const prod = process.env.NODE_ENV === 'production';

export default {
  publicPath: '/public/',
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/components/WxDynamicLoading',
  },
  define: {
    ...definitions,
  },
  proxy: proxy(),
  chainWebpack(memo) {
    // 设置 alias
    memo.resolve.alias.set('@wxapi', path.join(process.cwd(), 'src', '.wxboot', 'wxapi'));
    // 压缩gzip
    if (prod) {
      memo.plugin('compression').use(CompressionPlugin, [
        {
          test: /\.js$|\.css$/,
        },
      ]);
    }

    // monaco
    memo.plugin('monaco-editor-webpack-plugin').use(
      // 更多配置 https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      new MonacoWebpackPlugin(),
    );
    memo
      .plugin('d1-ignore')
      .use(
        // eslint-disable-next-line
        require('webpack/lib/IgnorePlugin'),
        [
          /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
          /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/,
        ],
      )
      .end()
      .plugin('d1-replace')
      .use(
        // eslint-disable-next-line
        require('webpack/lib/ContextReplacementPlugin'),
        [/monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/, __dirname],
      );
    return memo;
  },
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: false,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed',
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@material-ui/icons',
        // Use "'libraryDirectory': ''," if your bundler does not support ES modules
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'core',
    ],
  ],
};

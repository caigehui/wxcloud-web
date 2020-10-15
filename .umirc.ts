import DotenvFlow from 'dotenv-flow-webpack';
import { config } from 'dotenv-flow';
import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';
config({ silent: true });

// env file 注入到前端
const definitions = new DotenvFlow().definitions;
for (const key in definitions) {
  definitions[key] = definitions[key].substr(1);
  // 移除"号
  definitions[key] = definitions[key].substr(0, definitions[key].length - 1);
}

const prod = process.env.NODE_ENV === 'production';

const Config = (extraOptions?: Object) =>
  Object.assign(
    {
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
      proxy: {
        '/wxapi': {
          target: definitions['process.env.PROXY_TARGET'],
          changeOrigin: true,
        },
      },
      chainWebpack(memo) {
        // 设置 alias
        memo.resolve.alias.set('@wxapi', path.join(process.cwd(), 'src', '.wxboot', 'wxapi'));
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
    },
    prod
      ? {
          chainWebpack(memo) {
            memo.resolve.alias.set('@wxapi', path.join(process.cwd(), 'src', '.wxboot', 'wxapi'));
            memo.plugin('compression').use(CompressionPlugin, [
              {
                test: /\.js$|\.css$/,
              },
            ]);
          },
        }
      : {},
    extraOptions,
  );

export default Config();

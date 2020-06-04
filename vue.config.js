/* ===================================
 * vue-cli 3.x配置文件
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
const os = require('os');
const path = require('path');
// const webpack = require('webpack');
// const vConsolePlugin = require('vconsole-webpack-plugin'); // 引入 移动端模拟开发者工具 插件 （另：https://github.com/liriliri/eruda）
// const SentryPlugin = require('@sentry/webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin'); // Gzip
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // Webpack包文件分析器
const production = process.env.NODE_ENV === 'production';   // 是否生产环境
const debug = process.env.VUE_APP_DEBUG === 'true';         // 是否开启debug
const report = process.env.VUE_APP_REPORT === 'true';       // 是否输出编译统计报告

const resolve = dir => path.join(__dirname, dir);

const publicPath = production ? process.env.VUE_APP_BASE : '/'; // 资源路径，不同环境切换控制

/**
 * 获取客户端IP
 */
const getClientIP = () => {
	const interfaceAddresses = os.networkInterfaces();
	for (const prop in interfaceAddresses) {
		if (Object.prototype.hasOwnProperty.call(interfaceAddresses, prop)) {
			const interfaceAddress = interfaceAddresses[prop];
			for (const alias of interfaceAddress) {
				if (alias && alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
					return alias.address;
				}
			}
		}
	}
};

/**
 * 包装代理配置
 * @param proxyOption
 * @param prefix
 * @param url
 * @param replace
 */
const packOption = (proxyOption, prefix, url, replace) => {
	proxyOption[prefix] = {
		target: url,
		secure: false,
		changeOrigin: true,
		debug: true,
		pathRewrite: {
			[`^${ prefix }`]: ''
		}
	};
	if (replace) {
		delete proxyOption[prefix].pathRewrite;
	}
	return proxyOption;
};

/**
 * 获取代理配置
 * @param {Array<{ prefix: String,  url: String, replace: Boolean=}>} list
 */
const getProxyOption = (list = []) => {
	const proxyOption = {};
	list.forEach(item => {
		if (Array.isArray(item.prefix)) {
			for (const key of item.prefix) {
				packOption(proxyOption, key, item.url, item.replace);
			}
		} else {
			packOption(proxyOption, item.prefix, item.url, item.replace);
		}
	});
	return proxyOption;
};

module.exports = {
	// 基本路径
	publicPath, // 资源路径，不同环境切换控制
	// 输出文件目录
	outputDir: 'dist',
	// eslint-loader 是否在保存的时候检查
	lintOnSave: true,
	// 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
	// assetsDir: 'static',
	// 以多页模式构建应用程序
	pages: undefined,
	// 是否使用包含运行时编译器的 Vue 构建版本
	runtimeCompiler: false,
	// 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
	parallel: require('os').cpus().length > 1,
	// 生产环境是否生成 sourceMap 文件，一般情况不建议打开
	productionSourceMap: false,
	// productionSourceMap: true,

	// webpack配置
	// 对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	chainWebpack: config => {
		/**
		 * 删除懒加载模块的prefetch，降低带宽压力
		 * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
		 * 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
		 */
		//config.plugins.delete('prefetch');
		//if(process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
		//} else {// 为开发环境修改配置...
		//}

		// 设置路径别名
		// key, value自行定义
		// config.resolve.alias.set('@', resolve('src'));

		config.resolve.alias
			.set('@', resolve('src'))
			.set('@api', resolve('src/api'))
			.set('@assets', resolve('src/assets'))
			.set('@comp', resolve('src/components'))
			.set('@views', resolve('src/views'))
			.set('@layout', resolve('src/layout'));

		// 配置 webpack 识别 markdown 为普通的文件
		config.module
			.rule('markdown')
			.test(/\.md$/)
			.use('')
			.loader('file-loader')
			.end();
	},
	// 调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
	configureWebpack: config => {

		// 生产环境取消 console.log
		if (production) {
			config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
			// config.optimization.splitChunks.maxSize = 250000;
		}

		// 生产and测试环境
		const pluginsPro = [
			new CompressionPlugin({ // 文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
				filename: '[path].gz[query]',
				algorithm: 'gzip',
				// test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
				test: /\.js$|\.html$|\.json$|\.css/,
				threshold: 8192,
				minRatio: 0.8
			})/*,
            new vConsolePlugin({
                filter: [], // 需要过滤的入口文件
                enable: production // 发布代码前记得改回 false
            })*/
		];
		if (report) {
			// Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
			pluginsPro.push(new BundleAnalyzerPlugin());
		}
		// 开发环境
		const pluginsDev = [];
		if (debug) {
			// pluginsDev.push(
			// 	// 移动端模拟开发者工具(https://github.com/diamont1001/vconsole-webpack-plugin  https://github.com/Tencent/vConsole)
			// 	new vConsolePlugin({
			// 		filter: [], // 需要过滤的入口文件
			// 		enable: !production // 发布代码前记得改回 false
			// 	})
			// );
		}
		if (production) { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
			config.plugins = [...config.plugins, ...pluginsPro];
		} else {
			// 为开发环境修改配置...
			config.plugins = [...config.plugins, ...pluginsDev];
		}

		if (production) {
			// new SentryPlugin({
			// 	// 指定上传目录
			// 	include: './dist',
			// 	// 指定发布版本
			// 	release: process.env.RELEASE_VERSION,
			// 	configFile: 'sentry.properties',
			// 	// 保持与publicPath相符
			// 	urlPrefix: publicPath
			// 	// ignore: ['node_modules']
			// });
		}

		if (production) {
			// fix:css warning Conflicting order. Following module has been added
			config.plugins.push(
				new MiniCssExtractPlugin({
					ignoreOrder: true
				})
			);
		}

		// 优化打包chunk-vendor.js文件体积过大
		// 当我们运行项目并且打包的时候，会发现chunk-vendors.js这个文件非常大，
		// 那是因为webpack将所有的依赖全都压缩到了这个文件里面，这时我们可以将其拆分，将所有的依赖都打包成单独的js。
		if (production) {
			// 开启分离js
			config.optimization = {
				runtimeChunk: 'single',
				splitChunks: {
					chunks: 'all',
					maxInitialRequests: Infinity,
					minSize: 20000,
					cacheGroups: {
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name(module) {
								// get the name. E.g. node_modules/packageName/not/this/part.js
								// or node_modules/packageName
								const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
								// npm package names are URL-safe, but some servers don't like @ symbols
								return `npm.${ packageName.replace('@', '') }`;
							}
						}
					}
				}
			};
		}
	},
	css: {
		// requireModuleExtension: false, // 是否开启支持'foo.module.css'样式
		// extract: true,   // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
		extract: production ? { ignoreOrder: true } : false,
		sourceMap: false,   // 是否在构建样式地图，false将提高构建速度，一般不建议开启
		loaderOptions: {    // css预设器配置项
			less: {
				modifyVars: {
					/* less 变量覆盖，用于自定义 ant design 主题 */
					'primary-color': '#1890ff',
					'link-color': '#1890ff',
					'border-radius-base': '4px'
				},
				javascriptEnabled: true
			}
		}
	},
	// webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
	devServer: {
		// host: getClientIP(),
		port: 8899, // 端口号
		// https: false, // https:{type:Boolean}
		// open: process.platform === 'darwin', // 配置自动启动浏览器  http://172.20.13.254:8888/
		hotOnly: true, // 热更新
		inline: true,  // 实时刷新
		// disableHostCheck: true, // 禁用webpack热重载检查 解决热更新失效问题
		// proxy: 'http://localhost:8000'   // 配置跨域处理,只有一个代理
		// before: app => {},
		/**
		 * 配置跨域处理,多个代理
		 */
		proxy: getProxyOption([
			{
				prefix: [
					'/dev/admin/mock',
					'/local/mock'
				],
				url: 'https://femock.com/api/mock/202064'
			}
		])
	},

	// 第三方插件配置 https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
	pluginOptions: {
		// 'style-resources-loader': { // https://github.com/yenshih/style-resources-loader
		// 	preProcessor: 'scss', // 声明类型
		// 	'patterns': [
		// 		// path.resolve(__dirname, './src/assets/scss/_common.scss'),
		// 	]
		// 	// injector: 'append'
		// }
		/**
		 * 使用vue-cli-plugin-dll提升构建速度, 构建时间14s => 5s
		 * @description 构建前端项目时往往希望第三方库(vendors)和自己的代码可以分开打包, 因为第三方包不会经常变化
		 * @doc https://github.com/fingerpan/vue-cli-plugin-dll
		 * @side-effects 使用dll似乎影响了sentry对sourceMap问题的定位, 因此为了sentry, 放弃dll
		 */
		// dll: {
		// 	entry: ['vue', 'vue-router', 'vuex', 'axios'],
		// 	open: process.env.NODE_ENV === 'production',
		// 	inject: true
		// }
	}
};

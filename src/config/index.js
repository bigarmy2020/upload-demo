/* ===================================
 * 项目全局配置文件
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
const environments = {
	development: {
		log: true,                                     // 是否开启日志
		// basePath: '/mock',
		basePath: '/dev/admin',                         // API地址(开发环境)
		// basePath: '/qy/admin',                         // API地址(联调环境)
		// basePath: '/test/admin',                        // API地址(测试环境)
		// basePath: '/local',                             // API地址(本地环境)
		wsUrl: 'ws://127.0.0.1:8080/websocket',         // webSocket地址
		staticDomainURL: '/static/sys/common/static',   // 静态资源服务器地址
		sentry: {
			open: true,
			debug: false,
			dsn: 'http://xxxx@sentry.fmock.cn/2'
		}
	},
	test: {
		log: false,                                     // 是否开启日志
		basePath: '/api/admin',                         // API地址
		wsUrl: 'ws://127.0.0.1:8080/websocket',         // webSocket地址
		staticDomainURL: '/static/sys/common/static',   // 静态资源服务器地址
		sentry: {
			open: true,
			debug: false,
			dsn: 'http://xxxx@sentry.fmock.cn/2'
		}
	},
	production: {
		log: false,                                     // 是否开启日志
		basePath: '/api/admin',                         // API地址
		wsUrl: 'ws://127.0.0.1:8080/websocket',         // webSocket地址
		staticDomainURL: '/static/sys/common/static',   // 静态资源服务器地址
		sentry: {
			open: true,
			debug: false,
			dsn: 'http://xxxx@sentry.fmock.cn/3'
		}
	}
};

const Config = environments[process.env.VUE_APP_MODE] || {};

const production = process.env.NODE_ENV === 'production';   // 是否生产环境
Config.production = production;

export { Config };

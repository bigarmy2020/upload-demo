/* ===================================
 * 日志管理
 * Created by cjking on 2020/05/2.
 * Copyright 2020, Inc.
 * =================================== */
/* eslint-disable */
import { Config } from '@/config';
import { captureException } from '@sentry/browser';

export const logger = {
	log(value, ...rest) {
		if (Config.log) {
			console.log(value, ...rest);
		}
	},

	error(...args) {
		let message,
			error;
		if (args.length === 1) {
			message = '';
			error = args[0];
		} else if (args.length > 1) {
			message = args[0];
			error = args[1];
		}
		console.error(message, error);
		captureException(error);
	},

	warn(value, ...rest) {
		if (Config.log) {
			console.warn(value, ...rest);
		}
	},

	dom(ele) {
		if (Config.log) {
			console.log('%O', ele);
		}
	},

	time(timerName) {
		if (Config.log) {
			console.time(timerName);
		}
	},

	timeEnd(timerName) {
		if (Config.log) {
			console.timeEnd(timerName);
		}
	},

	group(...rest) {
		if (Config.log) {
			console.group(rest);
		}
	},

	groupEnd() {
		if (Config.log) {
			console.groupEnd();
		}
	}
};

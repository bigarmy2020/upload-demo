/* ===================================
 * 自定义指令
 * Created by cjking on 2020/05/02.
 * Copyright 2020, Inc.
 * =================================== */
import Vue from 'vue';
import { CheckInputDirective } from '@/directives/checkInput';
import { CurrencyDirective } from '@/directives/currency';
import { DownloadDirective } from '@/directives/download';
import { HighlightDirective } from '@/directives/highlight';

export const initDirectives = () => {
	Vue.use(CheckInputDirective);
	Vue.use(CurrencyDirective);
	Vue.use(DownloadDirective);
	Vue.use(HighlightDirective);
};

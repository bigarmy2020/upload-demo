/* ===================================
 * 评测订单 API
 * Created by cjking on 2020/05/21.
 * Copyright 2020, Inc.
 * =================================== */
import * as http from '@/http';

/**
 * 获取评测订单列表
 * @param params
 * @returns {Promise}
 */
export const getEvaluationOrderList = (params) => http.get('/schoolUserTask/listAssessTaskByUser', params);

/**
 * 测评中心管理-通过id查询订单详细信息
 * @param params
 * @returns {Promise}
 */
export const getEvaluationOrderDetail = (params) => http.get('/schoolUserWorkAssess/queryTaskDetailById', params);

/**
 * 测评管理-开始评测
 * @param params
 * @returns {Promise}
 */
export const beginAssess = (params) => http.put('/schoolUserWorkAssess/beginAssess', params);

/**
 * 测评管理-评测得分提交
 * @param params
 * @returns {Promise}
 */
export const saveAssess = (params) => http.put('/schoolUserWorkAssess/assessScore', params);

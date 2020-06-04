/* ===================================
 * 全局枚举配置文件
 * Created by cjking on 2020/05/25.
 * Copyright 2020, Inc.
 * =================================== */

/**
 * 禁用状态
 */
export const FrozenEnum = {
	ENABLED: 1, // 解冻状态
	DISABLED: 2 // 禁用状态
};

/**
 * 用户类型
 */
export const UserTypeEnum = {
	SCHOOL: 1,              // 学校
	ENTERPRISE: 2,          // 企业
	EVALUATION_PEOPLE: 3    // 测评人
};

/**
 * 测评状态
 */
export const EvaluationEnum = {
	UNFINISHED: 1,  // 未完成
	FINISHED: 2     // 已完成
};

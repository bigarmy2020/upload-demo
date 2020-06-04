module.exports = {
	root: true,
	env: {
		browser: true
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended'
	],
	parserOptions: {
		parser: 'babel-eslint'
	},
	// add your custom rules here
	// "off"或者0     // 关闭规则关闭
	// "warn"或者1    // 在打开的规则作为警告（不影响退出代码）
	// "error"或者2   // 把规则作为一个错误（退出代码触发时为1）
	rules: {
		// 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-console': 'error',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'indent': 'off',
		// 缩进规范（两个空格，一倍缩进）
		'vue/script-indent': ['error', 'tab', {
			'baseIndent': 0,
			'switchCase': 1,
			'ignores': []
		}],
		'vue/html-indent': ['error', 'tab', {
			'attribute': 1,
			'baseIndent': 1,
			'closeBracket': 0,
			'alignAttributesVertically': true,
			'ignores': []
		}],
		'block-spacing': 'error',
		'brace-style': [
			'error',
			'1tbs',
			{ 'allowSingleLine': true }
		],
		'camelcase': 0, // 不强制驼峰法命名
		'comma-spacing': 'error',
		'comma-style': [
			'error',
			'last'
		],
		'curly': [0, 'all'], // 关闭必须使用 if(){} 中的{}
		'dot-notation': [0, { 'allowKeywords': true }], // 避免不必要的方括号
		'eol-last': 'off',
		'eqeqeq': 'off',
		'no-cond-assign': 'error',
		'no-const-assign': 'error',
		'key-spacing': [0, { 'beforeColon': false, 'afterColon': true }], // 对象字面量中冒号的前后空格
		'keyword-spacing': 'error',
		'lines-around-comment': 'off',
		'new-cap': 'off', // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用(关闭校验)
		'new-parens': 'error',
		'no-array-constructor': 'error',
		'no-invalid-this': 'error',
		'no-multi-spaces': 'off',
		'no-redeclare': 'error',
		'no-return-assign': 'off',
		'no-spaced-func': 'error',
		'no-trailing-spaces': 1, // 一行结束后面不要有空格
		'semi': [0, 'always'], // 语句强制分号结尾
		'semi-spacing': [0, { 'before': false, 'after': true }], // 分号前后空格
		'space-before-function-paren': [0, 'never'], // 函数定义时括号前面要有空格
		'space-infix-ops': 'error',
		'space-unary-ops': [
			'error',
			{
				'words': true,
				'nonwords': false
			}
		],
		'no-irregular-whitespace': 2, // 不能有不规则的空格
		'yoda': [
			'error',
			'never'
		],
		'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复
		'no-dupe-args': 2, // 函数参数不能重复
		'no-duplicate-case': 2, // switch中的case标签不能重复
		'no-func-assign': 2, // 禁止重复的函数声明
		'no-mixed-requires': 'error',
		'padded-blocks': 'off',
		'no-unused-vars': 'off',
		'guard-for-in': 'off',
		'spaced-comment': 'off',
		'no-undef': 'off',
		'default-case': 0, // 关闭(switch语句最后必须有default)
		'no-unneeded-ternary': 'off',
		'one-var': 'off',
		'no-useless-return': 'off',
		'array-callback-return': 'off',
		'import/no-duplicates': 'off',
		'handle-callback-err': 'off',
		'no-multiple-empty-lines': 'off',
		'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
		'vue/no-unused-vars': 'off',
		'import/first': 'off',
		'vue/require-v-for-key': 'off',
		'vue/require-prop-type-constructor': 'off',
		'vue/no-use-v-if-with-v-for': 'off',
		'vue/no-unused-components': 'off',
		'vue/no-dupe-keys': 'off',
		'vue/require-valid-default-prop': 'off',
		'standard/no-callback-literal': 'off',
		'standard/object-curly-even-spacing': 'off',
		'no-empty': 'off',  // 禁止出现空语句块
		'no-useless-escape': 'error',       // 检查不必要的转义字符
		'no-mixed-spaces-and-tabs': 'off',  // 禁止使用 空格 和 tab 混合缩进
		'no-prototype-builtins': 'off',
		'no-async-promise-executor': 'off',
		'vue/no-textarea-mustache': 'off'
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)'
			],
			env: {
				mocha: true
			}
		},
		{
			'files': ['*.vue'],
			'rules': {
				'indent': 'off'
			}
		}
	]
};

/**
 * 升级package.json版本号
 * Usage:
 *  node updatePackageVersion.js backend/
 */
const fs = require('fs');
const path = require('path');

let dirPath = process.argv.slice(2).length ? process.argv.slice(2)[0] : '.';
dirPath = path.join(__dirname, dirPath);

const packageJson = require(`${ dirPath }/package.json`);

// 是否锁定版本
const lockedVersion = true;

const getFirstStr = (value) => {
	value = value.toString().substr(0, 1);
	if (/^[0-9]*$/g.test(value)) {
		value = '^';
	}
	return value;
};

const handleData = (key) => {
	let attrArr = Object.keys(packageJson[key] || {});
	for (const attr of attrArr) {
		fs.readdirSync(`${ dirPath }/node_modules/${ attr }`).filter((x) => ['package.json'].includes(x))
		.forEach((packageFile) => {
			const version = require(`${ dirPath }/node_modules/${ attr }/${ packageFile }`).version;
			if (packageJson[key] && packageJson[key][attr]) {
				const firstStr = getFirstStr(packageJson[key][attr]);
				packageJson[key][attr] = (!lockedVersion ? firstStr : '') + version;
			}
		});
	}
};

handleData('dependencies');
handleData('devDependencies');

fs.writeFileSync(`${ dirPath }/package.json`, JSON.stringify(packageJson, null, 4), { encoding: 'utf8' });
console.log(`package 替换 successfully.`); /* eslint-disable-line */

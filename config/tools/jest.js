const fs = require('fs');
// const childProcess = require('child_process');
// const chalk = require('chalk'); //粉笔
// const successChalk = chalk.rgb(13,188,121); //用于打印绿色log
// const failChalk = chalk.rgb(222,65,58); //用于打印红色log
const jest = require('jest');

// 执行jest单元测试脚本
console.log('=======start--jest=======');
// 默认执行目录
let testPath = '';
// 获取第一个参数
let pages = process.argv[2];

if (!pages) {
	// 默认不传参，执行全部目录下的jest
  testPath = '/.*.spec.js';
} else {
	// 字符串转数组，支持多个pages下的目录
	let array = pages.split(',');
	array.forEach(page => {
		let path = `src/pages/${page}/tests`;

		// 判断目录是否存在
		if (!fs.existsSync(path)) return console.log('测试目录不存在');
		if (!fs.statSync(path).isDirectory()) return console.log(path + '不是目录');
		if (fs.readdirSync(`src/pages/${page}/tests`).length) {
			testPath += ' ' + path + '/*.spec.js';
			console.log(page + '测试文件存在');
		} else {
			console.log(page + '测试文件不存在');
		}
	});
}

if (!testPath) {
	console.log('无可执行测试文件');
} else {
	console.log('开始执行测试');
	try {
		require('child_process').execSync(
			`jest ${testPath} -u --coverage --reporters default jest-stare`,
			{
				'stdio': 'inherit',
				'cwd': process.cwd()
			}
		);
	} catch(e) {
		console.error(e);
	}
}
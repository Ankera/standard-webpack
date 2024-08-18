const fs = require('fs')
const path = require('path')
// const Mock = require('mockjs')
/**
 * @param {string} filePath
 */
function getJsonFile(filePath) {
	let json = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8')
	return json
}

//重点部分，middlewares就是新增加的，原本只有devServer。
module.exports = function (middlewares, devServer) {
	//middlewares.unshift就是之前的before，middlewares.push是after
	middlewares.unshift({
		name: 'mock',
		// `path` 是可选的
		path: '/user/userInfo',
		middleware: (req, res) => {
			// let json = getJsonFile('./userinfo.json') //mock数据的样式，自己新建。
			// res.send(Mock.mock(json))
      res.send({
        code: 1,
        data: [
          {
            name: 'Tom'
          }
        ]
      })
		},
	})
	//return别忘了
	return middlewares
}


/**
 * https://blog.csdn.net/qq_39330914/article/details/127309359?spm=1001.2101.3001.6650.17&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-17-127309359-blog-128980493.235%5Ev43%5Epc_blog_bottom_relevance_base2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-17-127309359-blog-128980493.235%5Ev43%5Epc_blog_bottom_relevance_base2
 */
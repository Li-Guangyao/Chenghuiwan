// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 查询帖子，模糊匹配
exports.main = async (event, context) => {
	var keyWords = event.searchKeyWords

	return db.collection('t_post').where(_.or([{
		title: db.RegExp({
			regexp: '.*' + keyWords,
			options: 'i',
		})
	}, {
		content: db.RegExp({
			regexp: '.*' + keyWords,
			options: 'i',
		})
	}])).get()
}
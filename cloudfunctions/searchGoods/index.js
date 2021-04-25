// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 查询商品，模糊匹配
exports.main = async (event, context) => {
	var keyWords = event.keyWords

	return db.collection('t_goods').where(_.or([{
			title: db.RegExp({
				regexp: '.*' + keyWords,
				options: 'i',
			})
		},
		{
			detail: db.RegExp({
				regexp: '.*' + keyWords,
				options: 'i',
			})
		}
	])).get()
}
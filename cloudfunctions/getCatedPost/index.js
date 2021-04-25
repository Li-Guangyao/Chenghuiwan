// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 获取某个cate的帖子
exports.main = async (event, context) => {
	return db.collection('t_post').where({
		cate: event.cateName
	}).get()
}
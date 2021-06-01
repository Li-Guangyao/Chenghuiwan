// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

	// 获取这个帖子的所有评论
	return db.collection('t_post_comment').aggregate().match({
		postId: event.postId
	}).sort({
		createdAt: -1
	}).end().then(res => {
		return res.list
	})
}
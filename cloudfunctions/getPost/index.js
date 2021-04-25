// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 获取某个人发布的帖子，或者某个帖子
exports.main = async (event, context) => {
	if (event.openId != undefined) {
		// 获取某个人的帖子
		return 'a'
		// return db.collection('t_post').where({
		// 	_openid: event.openId
		// }).get()
	} else if (event.Id != undefined) {
		// 获取某个帖子
		return 'b'
		// return db.collection('t_post').doc(event.postId).get()
	} else {
		// 获取自己的帖子
		return 'c'
		// return db.collection('t_post').where({
		// 	_id: event.userInfo.Id
		// }).get()
	}

}
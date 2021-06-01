const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 用户对某个帖子点击like
exports.main = async (event, context) => {

	if (event.add == true) {
		db.collection('t_like_post').add({
			data: {
				_openid: event.userInfo.openId,
				postId: event.postId
			}
		})
	} else {
		db.collection('t_like_post').where({
			_openid: event.userInfo.openId,
			postId: event.postId
		}).remove()
	}
}
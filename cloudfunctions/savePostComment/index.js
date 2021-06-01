// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 保存帖子的评论
exports.main = async (event, context) => {
	var userAvatarUrl = null
	var userNickname = null

	await db.collection('t_user').where({
		_openid: event.userInfo.openId
	}).get().then(res=>{
		userAvatarUrl = res.data[0].avatarUrl,
		userNickname = res.data[0].nickname
	})

	return db.collection('t_post_comment').add({
		data:{
			_openid: event.userInfo.openId,
			userAvatar: userAvatarUrl,
			nickname: userNickname,

			postId: event.postId,
			content: event.content,
			createdAt: new Date(),
		}
	})
}
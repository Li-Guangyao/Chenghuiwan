// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 保存新帖子
exports.main = async (event, context) => {
	var userAvatarUrl = null
	var userNickname = null

	await db.collection('t_user').where({
		_openid: event.userInfo.openId
	}).get().then(res=>{
		userAvatarUrl = res.data[0].avatarUrl,
		userNickname = res.data[0].nickname
	})

	return db.collection('t_post').add({
		data:{
			_openid: event.userInfo.openId,
			user_avatar_url: userAvatarUrl,
			user_nickname: userNickname,

			title: event.title,
			content: event.content,
			created_at: event.createdAt,
			post_photo: event.postPhoto,
			like_amout: event.likeAmount,
			is_deleted: event.isDeleted,

		}
	})


}
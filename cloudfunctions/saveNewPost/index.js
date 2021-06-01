// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 保存新帖子
exports.main = async (event, context) => {
	var userAvatarUrl = null
	var userNickname = null
	var location = null
	var locationName = null

	await db.collection('t_user').where({
		_openid: event.userInfo.openId
	}).get().then(res => {
		userAvatarUrl = res.data[0].avatarUrl,
			userNickname = res.data[0].nickname
	})

	if(event.location){
		location = new db.Geo.Point(Number(event.location.longitude), Number(event.location.latitude))
		locationName = event.location.name
	}

	return db.collection('t_post').add({
		data: {
			_openid: event.userInfo.openId,
			userAvatar: userAvatarUrl,
			nickname: userNickname,

			title: event.title,
			content: event.content,
			photo: event.postPhoto,

			location: location,
			locationName: locationName,

			createdAt: new Date(),
			likeNumber: 0,
			isDeleted: false,
		}
	})
}
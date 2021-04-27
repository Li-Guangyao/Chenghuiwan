const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {

	if (event.add == true) {
		db.collection('t_fan').add({
			data: {
				fan_openid: event.userInfo.openId,
				followed_openid: event.openId
			}
		})
	} else {
		db.collection('t_fan').where({
			fan_openid: event.userInfo.openId,
			followed_openid: event.openId
		}).remove()
	}
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 查找关注的人
exports.main = async (event, context) => {
	var openId = event.openId
	var fanList = []

	await db.collection('t_fan').aggregate().match({
		followed_openid: openId
	}).lookup({
		from: 't_user',
		localField: 'fan_openid',
		foreignField: '_openid',
		as: 'fanList',
	}).end().then(res => {
		fanList = res.list
	}).catch(err => {})

	return fanList
}
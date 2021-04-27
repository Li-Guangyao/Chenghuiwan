// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 查找关注的人
exports.main = async (event, context) => {
	var openId = event.openId
	var followedList = []

	await db.collection('t_fan').aggregate().match({
		fan_openid: openId
	}).lookup({
		from: 't_user',
		localField: 'followed_openid',
		foreignField: '_openid',
		as: 'followedList',
	}).end().then(res => {
		followedList = res.list
	}).catch(err => {})

	return followedList
}
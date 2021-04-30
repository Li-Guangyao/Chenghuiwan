// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 查找已关注的人的动态
exports.main = async (event, context) => {
	var openId = event.openId
	var followedPostList = []

	await db.collection('t_fan').aggregate().match({
		fan_openid: openId
	}).lookup({
		from: 't_post',
		localField: 'followed_openid',
		foreignField: '_openid',
		as: 'followedPostList',
	}).end().then(res => {
		followedPostList = res.list[0]
	}).catch(err => {})

	return followedPostList
}
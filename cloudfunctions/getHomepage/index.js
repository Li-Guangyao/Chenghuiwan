// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate

async function judgeFollowed(myOpenId, otherOpenId) {
	return db.collection('t_fan').where({
		fan_openid: myOpenId,
		followed_openid: otherOpenId
	}).count().then(res => {
		if (res.total == 0) {
			return false
		} else {
			return true
		}
	})
}

// 进入某个人的个人主页
// 获取个人信息，获取该人的所有帖子，获取该人的粉丝数量，关注的人数量，获赞数量
// 获取本人是否关注该人
exports.main = async (event, context) => {

	var userInfo = {}
	var postList = []
	var fanNum = 0
	var followedNum = 0
	var isFollowed = false

	// 获取个人信息
	await db.collection('t_user').where({
		_openid: event.openId
	}).get().then(res => {
		userInfo = res.data[0]
	})

	// 获取该人所有帖子
	await db.collection('t_post').where({
		_openid: event.openId
	}).get().then(res => {
		postList = res.data
	})

	// // 获取该人关注了多少人
	// await db.collection('t_fan').aggregate().match({
	// 	fan_openid: event.openId
	// }).group({
	// 	_id: '$fan_openid',
	// 	count: $.sum(1)
	// }).end().then(res => {
	// 	followedNum = res.data
	// })

	// // 获取多少人关注了该人
	// await db.collection('t_fan').aggregate().match({
	// 	followed_openid: event.openId
	// }).group({
	// 	_id: '$followed_openid',
	// 	count: $.sum(1)
	// }).end().then(res => {
	// 	fanNum = res.data
	// })

	// 查询自己是否关注了该人
	isFollowed = await judgeFollowed(event.userInfo.openId, event.openId)

	return {
		'userInfo': userInfo,
		'postList': postList,
		// 'fanNum': fanNum,
		// 'followedNum': followedNum,
		'isFollowed': isFollowed
	}
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	var collectionList = []

	await db.collection('t_collection').aggregate().match({
			_openid: event.userInfo.openId
		}).lookup({
			from: 't_goods',
			localField: 'goods_id',
			foreignField: '_id',
			as: 'collectionList',
		}).end()
		.then(res => {
			collectionList = res.list[0].collectionList
		}).catch(err => {})

	return collectionList
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate

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
		}).replaceRoot({
			newRoot: $.mergeObjects([$.arrayElemAt(['$collectionList', 0]), '$$ROOT'])
		}).end()
		.then(res => {
			collectionList = res.list
		}).catch(err => {})

	return collectionList
}
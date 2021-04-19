// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {

	return db.collection('t_order').aggregate().match({
		_openid: event.userInfo.openId
	}).group({
		_id: '$status',
		count: $.sum(1)
	}).end()
}
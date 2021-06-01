// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {

	return  db.collection('t_fan').aggregate().match({
		fan_openid: event.openId
	}).group({
		_id: '$fan_openid',
		count: $.sum(1)
	}).end().then(res => {
		return res.list[0].count
	})
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 确认收货
exports.main = async (event, context) => {
	var orderId = event.orderId
	return db.collection('t_order').where({
		_id: orderId
	}).update({
		data:{
			status: 3
		}
	})
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	var orderList = []
	var goodsList = []

	// 10是查询全部订单
	if (event.orderType == 10) {
		return db.collection('t_order').where({
			_openid: event.userInfo.openId
		}).get()
	} else {
		return db.collection('t_order').where({
			_openid: event.userInfo.openId,
			status: event.orderType
		}).get()
	}
}
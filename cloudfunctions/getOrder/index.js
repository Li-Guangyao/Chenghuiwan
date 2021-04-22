// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	var orderList = []
	var goodsList = []

	// 10是查询全部订单
	if (event.orderType == 10) {
		return db.collection('t_order').where({
			_openid: event.userInfo.openId
		}).get()
		// 查询
	} else if (event.orderType == 15) {
		return db.collection('t_order').where({
			_openid: event.userInfo.openId,
			status: _.in([4, 7]).or(_.in([11, 14]))
		}).get()
	} else {
		// 查询某种订单，例如待发货的订单
		return db.collection('t_order').where({
			_openid: event.userInfo.openId,
			status: event.orderType
		}).get()
	}
}
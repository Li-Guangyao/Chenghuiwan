// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 保存退货信息
exports.main = async (event, context) => {
	db.collection('t_order').doc(event.orderId).update({
		data:{
			// 申请退货，等待卖家确认
			status: 4
		}
	})

	db.collection('t_refund').add({
		data:{
			order_id: event.orderId,
			_openid: event.userInfo.openId,
			refund_type: event.refundType,
			refund_reason: event.refundReason,
			detailed_refund_reason: event.detaiiledRefundReason,
			file_list: event.fileList,
			created_at: event.createdAt
		}
	})


}
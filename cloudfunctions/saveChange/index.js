// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 保存换货信息
exports.main = async (event, context) => {
	db.collection('t_order').doc(event.orderId).update({
		data:{
			// 申请换货，等待卖家确认
			status: 5
		}
	})

	db.collection('t_change').add({
		data:{
			order_id: event.orderId,
			_openid: event.userInfo.openId,
			change_type: event.refundType,
			change_reason: event.refundReason,
			detailed_change_reason: event.detailedRefundReason,
			file_list: event.fileList,
			created_at: event.createdAt
		}
	})


}
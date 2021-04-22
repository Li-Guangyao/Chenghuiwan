// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 保存用户对某个订单的评论
// 同时把某个订单的状态修改为已评论
exports.main = async (event, context) => {
	db.collection('t_order').doc(event.orderId).update({
		data:{
			// 8代表订单所有流程走完，即已评论
			status: 8
		}
	})

	return db.collection('t_order_comment').add({
		data:{
			_openid: event.userInfo.openId,
			order_id: event.orderId,
			text_content: event.content,
			// 晒单照片
			image_list:  event.fileList,
			// 评分项
			desc_rate:  event.descRate,
			express_rate:  event.expressRate,
			service_rate:  event.serviceRate,

			created_date: event.createdDate
		}
	})
}
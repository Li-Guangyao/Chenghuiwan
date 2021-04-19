// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	return db.collection('t_order').add({
		data: {
			goods: event.goods,
			_openid: event.userInfo.openId,

			item_number: event.number,
			price_paid: event.totalPrice,
			status: event.orderStatus,

			remark: event.remark,

			created_date: event.createdDate,
			sent_date: null,
			delivery_date: null,

			express_company: '',
			express_number: '',

			sender_name: '',
			sender_address: '',
			sender_phone: '',

			receiver_name: event.address.receiverName,
			receiver_address: event.address.province + event.address.city + event.address.district + event.address.detailedAddress,
			receiver_phone: event.address.phoneNumber
		}
	})
}
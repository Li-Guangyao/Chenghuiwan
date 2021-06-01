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

			option: event.option,
			number: event.number,
			unitPrice: event.unitPrice,
			totalPrice: event.totalPrice,
			status: event.status,

			remark: event.remark,

			createdAt: new Date(),
			sentDate: null,
			deliveryDate: null,

			expressCompany: '',
			expressNumber: '',

			senderName: '',
			senderAddress: '',
			senderPhone: '',

			receiverName: event.address.receiverName,
			receiverAddress: event.address.province + event.address.city + event.address.district + event.address.detailedAddress,
			receiverPhone: event.address.phoneNumber
		}
	})
}
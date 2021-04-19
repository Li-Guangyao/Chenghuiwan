// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

	if (event.isDefaultAddress == true) {
		var openId = event.userInfo.openId
		//如果用户把该地址设为默认的，就把其他的地址取消默认
		db.collection('t_address').where({
				_openid: openId
			})
			.update({
				data: {
					isDefaultAddress: false
				}
			})
	} else if (!await defaultAddressExist(event)) {
		event.isDefaultAddress = true
	} else {}

	//保存地址到数据库
	return await db.collection('t_address').doc(event._id).update({
		data: {
			_openid: event.userInfo.openId,
			receiverName: event.receiverName,
			province: event.province,
			city: event.city,
			district: event.district,
			phoneNumber: event.phoneNumber,
			detailedAddress: event.detailedAddress,
			isDefaultAddress: event.isDefaultAddress,
		}
	})
}

async function defaultAddressExist(event) {
	const openId = event.userInfo.openId
	return await db.collection('t_address').where({
		_openid: openId,
		isDefaultAddress: true
	}).count().then(res => {
		if(res.total>=1){
			return true
		}else{
			return false
		}
	})
}
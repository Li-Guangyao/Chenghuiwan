// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const openId = event.userInfo.openId
	var defaultAddress = {}

	await db.collection('t_address').where({
		_openid: openId,
		isDefaultAddress: true
	}).get().then(res=>{
		// 数据库查询结果，均为数组，直接取第一个项
		// 所有数据格式，在云函数内部均要转化格式，前端直接可用，降低耦合度
		defaultAddress = res.data[0]
	})

	return {
		'defaultAddress': defaultAddress
	}
}
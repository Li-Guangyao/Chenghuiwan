const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

	return await db.collection('t_user').where({
		_openid: event.userInfo.openId
	}).get().then(res=>{
		return  res.data[0]
	})
}
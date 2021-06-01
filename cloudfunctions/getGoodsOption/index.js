// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	var goodsOption = null

	await db.collection('t_goods_option').doc(event.goodsOptionId).get().then(res => {
		goodsOption = res.data.option
	})

	return goodsOption
}
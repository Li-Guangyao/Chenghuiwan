// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	var goodsCommentList = []
	
	await db.collection('t_order_comment').where({
		goods_id: event.goodsId
	}).get().then(res=>{
		goodsCommentList = res.data
	})

	return goodsCommentList
}
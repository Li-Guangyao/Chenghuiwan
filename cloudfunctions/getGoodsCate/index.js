const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {

	var firstLevelCate = new Set()
	var goodsCate
	var goodsCateTrans = {}

	await db.collection('t_goods_cate').get().then(res => {
		goodsCate = res.data
	})

	await goodsCate.forEach(item => {
		firstLevelCate.add(item.cate_name)
		goodsCateTrans[item.cate_name] = []
	})

	await goodsCate.forEach(item => {
		goodsCateTrans[item.cate_name].push(item.sub_cate_name)
	})

	return {
		// 云函数不能直接返回set对象，所以要转化为数组，才能返回
		'firstLevelCate': Array.from(firstLevelCate),
		'goodsCateTrans': goodsCateTrans
	}
}
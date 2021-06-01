// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

async function judgeCollected(openId, goodsId) {
	return db.collection('t_collection').where({
		_openid: openId,
		goods_id: goodsId
	}).count().then(res => {
		if (res.total == 0) {
			return false
		} else {
			return true
		}
	})
}

// 云函数入口函数
exports.main = async (event, context) => {

	var goods = {}
	var openId = event.userInfo.openId
	var goodsId = event.goodsId
	var isCollected = false

	var goodsOption = []
	var goodsOptionId = null

	await db.collection('t_goods').doc(goodsId).get().then(res => {
		goods = res.data
		if (res.data.pk_goods_option) {
			goodsOptionId = res.data.pk_goods_option
		}
	})

	if (goodsOptionId) {
		await cloud.callFunction({
			name: 'getGoodsOption',
			data: {
				goodsOptionId: goodsOptionId
			}
		}).then(res => {
			goodsOption = res.result
		})
	}

	isCollected = await judgeCollected(openId, goodsId)

	return {
		'isCollected': isCollected,
		'goods': goods,
		'goodsOption': goodsOption,
		'goodsOptionId': goodsOptionId
	}
}
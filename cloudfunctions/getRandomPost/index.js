// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	// return db.collection('t_post').get()
	if (event.newestDate) {
		var newestDate = new Date(event.newestDate)

		return db.collection('t_post').aggregate().match({
			createdAt: _.lt(newestDate)
		}).sort({
			createdAt: -1
		}).skip(event.skipNum).end().then(res => {
			return res.list
		})
	} else {
		return db.collection('t_post').aggregate().sort({
			createdAt: -1
		}).end().then(res => {
			return res.list
		})
	}
}
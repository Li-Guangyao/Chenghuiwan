// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

	return db.collection('t_post').where({
		location: _.geoNear({
			geometry: db.Geo.Point(Number(event.longitude), Number(event.latitude)),
			minDistance: 10,
			maxDistance: 10000,
		})
	}).get()
}
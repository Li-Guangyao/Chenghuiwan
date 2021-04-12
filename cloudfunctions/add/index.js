const cloud = require('wx-server-sdk')

exports.main = async (event, context) => {
  let { userInfo, a, b} = event
  let { OPENID, APPID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  let sum = a + b

  return {
	event,
	context
  }
}
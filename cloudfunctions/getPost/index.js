// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 获取某个人发布的帖子，或者某个帖子，或者自己的帖子
exports.main = async (event, context) => {
	if (event.postId) {
		// 本人是否已经点赞了这个帖子
		var isLiked = await judgeIsLiked(event.userInfo.openId, event.postId)
		var post = null
		var postCommentList = []

		// 获取这个帖子的内容
		await db.collection('t_post').doc(event.postId).get().then(res => {
			post = res.data
		})

		// 获取这个帖子的所有评论
		await db.collection('t_post_comment').where({
			post_id: event.postId
		}).get().then(res => {
			postCommentList = res.data
		})

		return {
			'isLiked': isLiked,
			'post': post,
			'postCommentList': postCommentList
		}
	} else {
		// 获取自己的帖子
		return db.collection('t_post').where({
			_openid: event.userInfo.openId
		}).get()
	}
}

// 判断本人是否已经点赞了这个帖子
async function judgeIsLiked(openId, postId) {
	return db.collection('t_like_post').where({
		_openid: openId,
		post_id: postId
	}).count().then(res => {
		if (res.total == 0) {
			return false
		} else {
			return true
		}
	})

}
import date from "../../utils/date"

Page({
	data: {
		postId: null,
		post: {},
		commentList: [],
		// 用户在这一个页面发表的评论内容
		commentContent: null,

		isLiked: false,
		originIsLiked: false,

		pageHeight: null
	},

	onLoad: async function (e) {
		this.setData({
			postId: e.postId
		})

		wx.showLoading({
			title: '加载中',
		})

		//根据底部下单区域的高矮，来初始化页面的大小
		var query = wx.createSelectorQuery()
		query.select('.input-comment').boundingClientRect()
		query.exec(res => {
			console.log(res)
			this.setData({
				pageHeight: res[0].top
			})
		})

		await wx.cloud.callFunction({
			name: 'getPost',
			data: {
				postId: e.postId
			}
		}).then(res => {
			this.setData({
				post: res.result.post,
				isLiked: res.result.isLiked,
				commentList: res.result.postCommentList
			})
		})

		wx.hideLoading()
	},

	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	onPullDownRefresh: function () {

	},

	onReachBottom: function () {

	},

	onShareAppMessage: function () {

	},

	// 预览帖子中的图片
	previewImage(e) {
		wx.previewImage({
			urls: this.data.post.post_photo,
			current: this.data.post.post_photo[e.currentTarget.dataset.index],
			showmenu: true,
		})
	},

	// 点击点赞按钮
	tapLike() {
		console.log('tapLike')
		if (this.data.isLiked == false) {
			this.setData({
				isLiked: true
			})
		} else if (this.data.isLiked == true) {
			this.setData({
				isLiked: false
			})
		}
	},

	// 离开页面
	onUnload: function () {
		// 判断用户是否（取消）给这个帖子点赞
		if (this.data.isLiked == true && this.data.originIsLiked == false) {
			wx.cloud.callFunction({
				name: 'updatePostLike',
				data: {
					postId: this.data.openId,
					add: true
				}
			})
		} else if (this.data.isLiked == false && this.data.originIsLiked == true) {
			wx.cloud.callFunction({
				name: 'updatePostLike',
				data: {
					openId: this.data.openId,
					add: false
				}
			})
		} else {}
	},

	commentInput(e) {
		this.setData({
			commentContent: e.detail.html
		})
	},

	// 发表评论
	publishComment() {
		wx.cloud.callFunction({
			name: 'savePostComment',
			data: {
				postId: this.data.post._id,
				content: this.data.commentContent,
				createdAt: date()
			}
		}).then(res => {
			wx.showToast({
				title: '保存成功',
			})
		}).catch(
			wx.hideLoading()
		)
	},

	// 点击了用户头像和昵称区域
	toHomepage() {
		wx.navigateTo({
			url: '../homepage/homepage?openId=' + this.data.post._openid,
		})
	}
})
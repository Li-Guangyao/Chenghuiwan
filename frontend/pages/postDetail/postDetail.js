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

		await this.getPost()
		await this.getComment()

		wx.hideLoading()
	},

	async getPost() {
		await wx.cloud.callFunction({
			name: 'getPost',
			data: {
				postId: this.data.postId
			}
		}).then(res => {
			console.log(res)
			this.setData({
				post: res.result.post,
				isLiked: res.result.isLiked,
			})
		})
	},

	async getComment(){
		wx.cloud.callFunction({
			name: "getPostComment",
			data:{
				postId: this.data.postId
			}
		}).then(res=>{
			this.setData({
				commentList: res.result
			})
		})
	},

	// 预览帖子中的图片
	previewImage(e) {
		wx.previewImage({
			urls: this.data.post.photo,
			current: this.data.post.photo[e.currentTarget.dataset.index],
			showmenu: true,
		})
	},

	// 点击点赞按钮
	tapLike() {
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
					postId: this.data.postId,
					add: true
				}
			})
		} else if (this.data.isLiked == false && this.data.originIsLiked == true) {
			wx.cloud.callFunction({
				name: 'updatePostLike',
				data: {
					openId: this.data.postId,
					add: false
				}
			})
		} else {}
	},

	// 用户输入评论
	commentInput(e) {
		this.setData({
			commentContent: e.detail.value
		})
	},

	// 发表评论
	publishComment() {
		if (this.data.commentContent) {
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
				this.setData({
					commentContent: ''
				})

				this.getComment()
			}).catch(
				wx.hideLoading()
			)
		}
	},

	// 点击了用户头像和昵称区域
	toHomepage() {
		wx.navigateTo({
			url: '../homepage/homepage?openId=' + this.data.post._openid,
		})
	}
})
Page({
	data: {
		openId: null,
		userInfo: {},
		postList: [],

		isFollowed: false,
		originIsFollowed: false,

	},

	onLoad:async function (e) {
		this.setData({
			openId: e.openId
		})

		wx.showLoading({
		  title: '加载中',
		})

		await wx.cloud.callFunction({
			name: 'getHomepage',
			data: {
				openId: e.openId
			}
		}).then(res => {
			console.log(res)
			this.setData({
				userInfo: res.result.userInfo,
				postList: res.result.postList,

				isFollowed: res.result.isFollowed,
				originIsFollowed: res.result.isFollowed
			})
		})

		wx.hideLoading({
		  success: (res) => {},
		})

	},

	// 查看该人关注的人
	viewFollowed() {
		wx.navigateTo({
			url: '../followedList/followedList?openId=' + this.data.openId,
		})
	},

	// 查看该人的粉丝
	viewFan() {
		wx.navigateTo({
			url: '../fanList/fanList?openId=' + this.data.openId,
		})
	},

	// 按下了关注按钮
	followBtn() {
		if (this.data.isFollowed == false) {
			this.setData({
				isFollowed: true
			})
		} else if (this.data.isFollowed == true) {
			this.setData({
				isFollowed: false
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
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

	onHide: function () {
		console.log('onHide')
	},

	onUnload: function () {
		// 判断用户是否（取消）关注该人
		if (this.data.isFollowed == true && this.data.originIsFollowed == false) {
			wx.cloud.callFunction({
				name: 'updateFollow',
				data: {
					openId: this.data.openId,
					add: true
				}
			})
		} else if (this.data.isFollowed == false && this.data.originIsFollowed == true) {
			wx.cloud.callFunction({
				name: 'updateFollow',
				data: {
					openId: this.data.openId,
					add: false
				}
			})
		} else {
			console.log('else')
		}
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})
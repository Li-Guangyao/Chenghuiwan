Page({

	data: {
		post: {},
		postId: {},
		commentList: [],
	},

	onLoad: async function (e) {
		this.setData({
			postId: e.postId
		})

		wx.showLoading({
			title: '加载中',
		})

		await wx.cloud.callFunction({
			name: 'getPost',
			data: {
				postId: e.postId
			}
		}).then(res => {
			console.log(res)
			// this.setData({
			// 	post: res.result.data[0]
			// })
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

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

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

	},

	previewImage(e) {
		wx.previewImage({
			urls: this.data.post.post_photo,
			current: this.data.post.post_photo[e.currentTarget.dataset.index],
			showmenu: true,
		})
	}
})
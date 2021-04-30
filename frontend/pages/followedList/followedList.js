Page({

	data: {
		openId: null,
		followedList: []
	},

	onLoad: function (e) {
		this.setData({
			openId: e.openId
		})

		wx.cloud.callFunction({
			name: 'getFollowed',
			data: {
				openId: e.openId
			}
		}).then(res=>{
			this.setData({
				followedList: res.result.followedList
			})
		})
	},

	onReady: function () {

	},

	onShow: function () {

	},

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

	}
})
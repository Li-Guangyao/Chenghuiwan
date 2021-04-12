const db = wx.cloud.database();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		addressList: [],
		//标识打开这个网页的上一个网页，如果是orderGenerate，可以实现长按选择地址并返回功能
		source: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		wx.showLoading({
			title: '加载中',
		})

		this.setData({
			source: e.source
		})

		// 获取用户地址，并渲染到前端
		var openId = wx.getStorageSync('openId')
		console.log(openId)
		db.collection('t_address').where({
			_openid: openId
		}).get().then(res => {
			this.setData({
				addressList: res.data
			})
		}).catch(err => {
			console.log(err)
		})

		wx.hideLoading({
			success: (res) => {},
		})

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

	addAddress() {
		wx.navigateTo({
			url: '../addAddress/addAddress',
		})
	},

	editAddress(e) {
		//向addressEdit页面发送一个地址
		//this.data.addressList[e.currentTarget.dataset.index]
		wx.navigateTo({
			url: '../addressEdit/addressEdit',
			success: (res) => {
				res.eventChannel.emit('acceptDataFromOpenerPage', {
					sentData: this.data.addressList[e.currentTarget.dataset.index]
				})
			}
		})
	},

	longPressAddress(e){
		console.log(e)
	}
})
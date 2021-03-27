const db = wx.cloud.database();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		addressList: []

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var openId = wx.getStorageSync('openId')
		console.log(openId)
		db.collection('t_order').doc(openId).get().then(res=>{
			console.log(res)
		}).catch(err=>{
			console.log(err)
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

	addAddress(){
		wx.navigateTo({
		  url: '../addAddress/addAddress',
		})
	},

	editAddress(e){
		console.log(e)
		wx.navigateTo({
		  url: '../addressEdit/addressEdit',
		})
	}
})
const db = wx.cloud.database()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		post: {},
		postPhotoList: [],
		currentPhotoIndex:1,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		//从post-display组件中直接跳转过来，传递这个帖子的_id
		//下次优化，可以使用JSON.parse，前端使用data-index绑定index，后端用JSON传递对象
		db.collection('t_post').doc(e.postId).get().then(e => {
			console.log(e)
			let postPhotoList = e.data.post_photo.map(item => item.url)
			this.setData({
				post: e.data,
				postPhotoList:postPhotoList
			})
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


	previewImage(e) {
		wx.previewImage({
			urls: this.data.postPhotoList,
			current: this.data.postPhotoList[e.currentTarget.dataset.index],
			showmenu: true,
			success: (res) => {
				console.log('预览图片chenggong')
			},
			fail: (res) => {
				console.log(res)
				console.log(this.data.postPhotoList[e.currentTarget.dataset.index])
			},
			complete: (res) => {
				console.log('预览图片jieshu')
			},
		})
	}
})
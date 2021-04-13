const db = wx.cloud.database();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		addressList: [],
		//标识打开这个网页的上一个网页，如果是orderGenerate，可以实现长按选择地址并返回功能
		source: 0,
		slideButtons: [{
			text: '编辑',
		}, {
			type: 'warn',
			text: '删除',
		}],
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
		wx.showLoading({
			title: '加载中',
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

	editAddress(addressIndex) {
		//向addressEdit页面发送一个地址
		wx.navigateTo({
			url: '../addressEdit/addressEdit',
			success: (res) => {
				res.eventChannel.emit('acceptDataFromOpenerPage', {
					sentData: this.data.addressList[addressIndex],
					addressIndex: addressIndex
				})
			}
		})
	},

	deleteAddress(addressIndex) {
		wx.showModal({
			content: '确认删除地址',
			cancelColor: 'cancelColor',
			confirmColor: "#1ae6e6"
		}).then(res => {
			if (res.confirm == true) {
				db.collection('t_address').doc(this.data.addressList[addressIndex]._id).remove()
				this.data.addressList.splice(addressIndex, 1)
				this.setData({
					addressList: this.data.addressList
				})
			}
		})
	},

	// 地址栏向左滑动，显示两个按钮，按动里面的按钮触发该事件
	slideButtonTap(e) {
		console.log(e)
		if (e.detail.index == 0) {
			// 点击编辑按钮
			this.editAddress(e.currentTarget.dataset.index)
		} else if (e.detail.index == 1) {
			//点击删除按钮
			this.deleteAddress(e.currentTarget.dataset.index)
		} else {}
	},

	// 单击选中地址，然后返回到orderGenerate页面
	choseAddress(e) {
		console.log('choseAddress')
		// 如果这个页面由orderGenerate页面跳转而来
		if (this.data.source == 1) {
			var pages = getCurrentPages();
			// var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面

			//直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
			prevPage.setData({
				defaultAddress: this.data.addressList[e.currentTarget.dataset.index]
			});
			wx.navigateBack({
				delta: 1
			})

			// wx.navigateBack({
			// 	delta: 1,
			// 	success: (res) => {
			// 		const eventChannel = this.getOpenerEventChannel()
			// 		eventChannel.emit('acceptDataFromOpenerPage', {
			// 			sentData: this.data.addressList[e.currentTarget.dataset.index]
			// 		})
			// 	}
			// }).then()
		}
	}
})
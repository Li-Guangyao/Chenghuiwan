const db = wx.cloud.database();

Page({

	data: {
		addressList: [],
		//标识打开这个网页的上一个网页，如果是orderGenerate，赋值为1，可以实现点击返回一个地址
		source: 0,
		slideButtons: [{
			text: '编辑',
		}, {
			type: 'warn',
			text: '删除',
		}],

		//由于底部设置了保存按键，如果列表太长，就会把他覆盖
		//用这个高度，初始化列表内容
		pageHeight:null,
	},

	onLoad: function (e) {
		this.setData({
			source: e.source
		})

		//设置整个页面的高度，如果不设置，地址列表过长会盖住下部的按钮
		var query = wx.createSelectorQuery()
		query.select('.add-address').boundingClientRect()
		query.exec(res=>{
			this.setData({
				pageHeight: res[0].top
			})
		})
	},

	onReady: function () {

	},

	onShow: async function () {
		wx.showLoading({
			title: '加载中',
		})

		// 获取用户地址，并渲染到前端
		await wx.cloud.callFunction({
			name: 'getAddress'
		}).then(res=>{
			this.setData({
				addressList: res.result.data
			})
		})

		wx.hideLoading({
			success: (res) => {},
		})
	},

	onHide: function () {

	},

	onUnload: function () {

	},

	onPullDownRefresh: function () {

	},

	onReachBottom: function () {

	},

	onShareAppMessage: function () {

	},

	addAddress() {
		wx.navigateTo({
			url: '../addressAdd/addressAdd',
		})
	},

	// 修改地址
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

	// 删除地址
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
		}
	}
})
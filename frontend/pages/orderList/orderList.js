Page({
	data: {
		orderType: null,
		orderList: null,
	},

	onLoad: async function (e) {
		this.setData({
			orderType: Number(e.orderType)
		})
		await this.getOrder(e.orderType)
	},

	async getOrder(orderType) {
		wx.showLoading({
		  title: '加载中',
		})

		await wx.cloud.callFunction({
			name: 'getOrder',
			data: {
				orderType: Number(orderType)
			}
		}).then(res => {
			console.log(res)
			this.setData({
				orderList: res.result.data
			})
		})

		wx.hideLoading({
		  success: (res) => {},
		})
	},

	// 点击订单，跳转
	clickOrder(e) {
		var order = JSON.stringify(this.data.orderList[e.currentTarget.dataset.index])
		wx.navigateTo({
			url: '../orderDetail/orderDetail?order=' + encodeURIComponent(order),
		})
	},

	// 取消订单
	cancelOrder(e) {
		wx.showModal({
			title: '确定取消订单？',
			showCancel: true
		}).then(res => {
			if (res.confirm) {
				// cancel
				wx.cloud.callFunction({
					name: 'cancelOrder',
					data: {
						orderId: this.data.orderList[e.currentTarget.dataset.index]._id
					}
				}).then(res => {
					wx.showToast({
						title: '取消成功',
					})
					// 重置页面数据
					this.data.orderList.splice(e.currentTarget.dataset.index, 1)
					this.setData({
						orderList: this.data.orderList
					})
				})
			} else {}
		})
	},

	// 支付
	payOrder() {
		wx.showModal({
			title: '确定支付订单',
			showCancel: true
		}).then(res => {
			if (res.confirm) {
				// cancel
				wx.cloud.callFunction({
					name: 'payOrder',
					data: {
						orderId: this.data.orderList[e.currentTarget.dataset.index]._id
					}
				})
			} else {}
		})
	},

	// 催促发货
	urgeSending(e) {
		wx.showModal({
			title: '已经提醒卖家快点发货',
			showCancel: false
		})
	},

	// 查询快递
	expressStatus(e) {
		wx.showModal({
			title: '查询快递信息',
			showCancel: false
		})
	},

	// 确认收货
	confirmReceiving(e) {
		wx.showModal({
			title: '确定收货',
			showCancel: true
		}).then(res => {
			if (res.confirm) {
				// cancel
				wx.cloud.callFunction({
					name: 'confirmReceiving',
					data: {
						orderId: this.data.orderList[e.currentTarget.dataset.index]._id
					}
				})

				this.setData({
					orderList: this.data.orderList.splice(e.currentTarget.dataset.index,1)
				})

				this.getOrder(2)
			} else {}
		})
	},

	// 去评价商品的页面
	toComment(e) {
		var order = JSON.stringify(this.data.orderList[e.currentTarget.dataset.index])
		wx.navigateTo({
			url: '../orderComment/orderComment?order=' + encodeURIComponent(order),
		})
	},

})
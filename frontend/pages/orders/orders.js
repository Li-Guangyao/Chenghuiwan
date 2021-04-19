// pages/orders/orders.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderType: null,
		orderList: []
	},

	onLoad: async function (e) {

		wx.showLoading({
			title: '加载中',
		})

		this.setData({
			orderType: Number(e.orderType)
		})

		await wx.cloud.callFunction({
			name: 'getOrder',
			data: {
				orderType: Number(e.orderType)
			}
		}).then(res => {
			console.log(res)
			if (res.result.data) {
				console.log(res)
				this.setData({
					orderList: res.result.data
				})
			} else {
				wx.showToast({
					icon: 'error',
					title: '空空如也',
				})
			}
		})

		wx.hideLoading({})
	},

	clickOrder(){

	},

	// 催促发货
	urgeSending(){
		wx.showModal({
			title: '已经提醒卖家快点发货',
			showCancel: false
		})
	}
})
const db = wx.cloud.database()

//获取标准的时间格式yyyy-mm-dd hh:mm，而非时间戳
import date from '../../utils/date'

Page({
	data: {
		defaultAddress: {},
		goods: {},

		// 买几个
		number: 1,
		// 订单总价，单位为分
		totalPrice: 0,
		unitPrice: 0,

		chosenGoodsOption: [],

		// 订单的留言
		remark: null
	},

	onLoad: async function (e) {
		wx.showLoading({
			title: '生成订单中',
		})

		this.getDefaultAddress()

		this.setData({
			goods: JSON.parse(decodeURIComponent(e.goods)),
			chosenGoodsOption: JSON.parse(e.option),
			unitPrice: Number(e.price),
			totalPrice: Number(e.price)
		})

		wx.hideLoading({
			success: (res) => {},
		})
	},

	//找到默认地址
	async getDefaultAddress(){
		await wx.cloud.callFunction({
			name: 'getDefaultAddress'
		}).then(res => {
			this.setData({
				defaultAddress: res.result.defaultAddress
			})
		})
	},

	// 点击提交订单按钮
	submitOrder() {
		wx.showModal({
			title: '点击确认，完成支付',
			showCancel: true
		}).then(res => {
			if (res.confirm) {
				this.orderToCloud(1)
				setTimeout(() => {
					wx.showToast({
						title: '下单成功',
						icon: "success",
					});

					setTimeout(() => {
						wx.hideToast();
					}, 2000)
				}, 0);

				//返回mall页面
				wx.navigateBack({
					delta: 2,
				})
			} else if (res.cancel) {
				// 生成未支付
				this.orderToCloud(0)
				wx.showModal({
					title: '请在30分钟内完成支付，否则订单会自动取消',
					showCancel: false
				}).then(res => {
					if (res.confirm) {
						// 到订单列表，催促支付
						wx.redirectTo({
							url: '../orderList/orderList?orderType=0',
						})
					}
				})
			} else {}
		})
	},

	// 多买一个
	addOne() {
		this.setData({
			number: this.data.number + 1,
			totalPrice: this.data.totalPrice + this.data.unitPrice
		})
	},

	// 少买一个
	minusOne() {
		if (this.data.number == 1) {} else {
			this.setData({
				number: this.data.number - 1,
				totalPrice: this.data.totalPrice - this.data.unitPrice
			})
		}
	},

	orderToCloud(orderStatus) {
		wx.cloud.callFunction({
			name: 'orderGenerate',
			data: {
				address: this.data.defaultAddress,
				goods: this.data.goods,
				option: this.data.chosenGoodsOption,
				number: this.data.number,
				unitPrice: this.data.unitPrice,
				totalPrice: this.data.totalPrice,
				remark: this.data.remark,
				// 订单生成未支付
				status: orderStatus
			}
		})
	},

})
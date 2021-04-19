const db = wx.cloud.database()

//获取标准的时间格式yyyy-mm-dd hh:mm，而非时间戳
import date from '../../utils/date'
Page({
	data: {
		defaultAddress: {},
		goodsItem: {},

		// 买几个
		number: 1,
		// 订单总价，单位为分
		totalPrice: 0,

		// 订单的留言
		remark: null

	},

	onLoad: async function (e) {
		console.log(e)

		wx.showLoading({
			title: '生成订单中',
		})

		//找到默认地址
		await wx.cloud.callFunction({
			name: 'getDefaultAddress'
		}).then(res => {
			console.log(res)
			this.setData({
				defaultAddress: res.result.defaultAddress
			})
		})

		// 获取商品
		await db.collection('t_goods').doc(e.goodsId).get().then(res => {
			this.setData({
				goodsItem: res.data
			})
		})

		this.setData({
			totalPrice: this.data.goodsItem.price * 100
		})

		wx.hideLoading({
			success: (res) => {},
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
							url: '../orders/orders?orderType=awaitPayment',
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
			totalPrice: this.data.totalPrice + this.data.goodsItem.price * 100
		})
	},

	// 少买一个
	minusOne() {
		if (this.data.number == 1) {} else {
			this.setData({
				number: this.data.number - 1,
				totalPrice: this.data.totalPrice - this.data.goodsItem.price * 100
			})
		}
	},

	orderToCloud(orderStatus) {
		wx.cloud.callFunction({
			name: 'orderGenerate',
			data: {
				address: this.data.defaultAddress,
				goods: this.data.goodsItem,
				number: this.data.number,
				remark: this.data.remark,
				totalPrice: this.data.totalPrice,
				createdDate: date(),
				// 订单生成未支付
				orderStatus: orderStatus
			}
		})
	}
})
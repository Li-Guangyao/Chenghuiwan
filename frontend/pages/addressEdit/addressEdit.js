const db = wx.cloud.database()

Page({
	data: {
		showPopup: false,
		areaList: {
			province_list: {
				110000: '北京市',
				120000: '天津市'
			},
			city_list: {
				110100: '北京市',
				120100: '天津市',
			},
			county_list: {
				110101: '东城区',
				110102: '西城区',
				110105: '朝阳区',
				110106: '丰台区',
				120101: '和平区',
				120102: '河东区',
				120103: '河西区',
				120104: '南开区',
				120105: '河北区',
			}
		},

		// 由addressList页面跳转而来，记录当前地址的index
		// 方便返回的时候在addressList页面上更新，而不必通过数据库
		addressIndex: null,

		//需要编辑的地址，和数据库保持一致
		_id: null,
		receiverName: '',
		province: '',
		city: '',
		district: '',
		phoneNumber: '',
		detailedAddress: '',
		isDefaultAddress: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const eventChannel = this.getOpenerEventChannel()

		eventChannel.on('acceptDataFromOpenerPage', (sentData, addressIndex) => {
			this.setData({
				addressIndex: addressIndex,
				// 地址属性
				_id: sentData.sentData._id,
				receiverName: sentData.sentData.receiverName,
				province: sentData.sentData.province,
				city: sentData.sentData.city,
				district: sentData.sentData.district,
				phoneNumber: sentData.sentData.phoneNumber,
				detailedAddress: sentData.sentData.detailedAddress,
				isDefaultAddress: sentData.sentData.isDefaultAddress,
			})
		})
	},

	showPopup() {
		this.setData({
			showPopup: true
		})
	},

	closePopup() {
		this.setData({
			showPopup: false
		})
	},

	changeDefaultAddress(e) {
		this.setData({
			isDefaultAddress: e.detail
		})
	},

	//在弹出框里面选择完省市，点击确定
	confirmOverallAddress(e) {
		this.setData({
			showPopup: false,
			province: e.detail.values[0].name,
			city: e.detail.values[1].name,
			district: e.detail.values[2].name,
		})
	},

	saveAddress() {
		wx.showModal({
			content: '确认保存地址',
			cancelColor: 'cancelColor',
			confirmColor: "#1ae6e6"
		}).then(res => {
			if (res.confirm == true) {
				wx.showLoading({
				  title: '保存中',
				  mask: true,
				})
				wx.cloud.callFunction({
					name: 'saveAddress',
					data: {
						_id: this.data._id,
						receiverName: this.data.receiverName,
						province: this.data.province,
						city: this.data.city,
						district: this.data.district,
						phoneNumber: this.data.phoneNumber,
						detailedAddress: this.data.detailedAddress,
						isDefaultAddress: this.data.isDefaultAddress,
					}
				}).then(res => {
					console.log("保存地址成功")
					wx.hideLoading({
					  success: (res) => {},
					})
					wx.showToast({
					  title: '保存成功',
					}).then(res => {
						wx.navigateBack({
						  delta: 1,
						})
					})
				})



				// if (this.data.isDefaultAddress == true) {
				// 	var openId = wx.getStorageSync('openId')
				// 	//如果用户把该地址设为默认的，就把其他的地址取消默认
				// 	db.collection('t_address').where({
				// 			_openid: openId
				// 		})
				// 		.update({
				// 			data: {
				// 				isDefaultAddress: false
				// 			}
				// 		})
				// }
				// //保存地址到数据库
				// db.collection('t_address').doc(this.data._id).update({
				// 		data: {
				// 			receiverName: this.data.receiverName,
				// 			province: this.data.province,
				// 			city: this.data.city,
				// 			district: this.data.district,
				// 			phoneNumber: this.data.phoneNumber,
				// 			detailedAddress: this.data.detailedAddress,
				// 			isDefaultAddress: this.data.isDefaultAddress,
				// 		}
				// 	})
				// 	.then(res => {
				// 		console.log("保存地址成功")
				// 		wx.showModal({
				// 			showCancel: false,
				// 			content: "保存成功",
				// 			confirmText: '确定'
				// 		}).then(res => {
				// 			wx.redirectTo({
				// 				url: '../addressList/addressList',
				// 			})
				// 		})
				// 	})



			}
		}).catch()

	},


})
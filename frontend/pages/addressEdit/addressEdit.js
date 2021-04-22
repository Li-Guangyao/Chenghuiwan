const db = wx.cloud.database()
import areaList from '../../utils/areaList'

Page({
	data: {
		showPopup: false,
		areaList: {},

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
		//地址列表
		this.setData({
			areaList: areaList
		})

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
		if (this.meetRequirement()) {
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
						console.log(res)
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
				}
			}).catch()
		} else {
			wx.showToast({
				title: '地址信息没有填写完整！',
			})
		}
	},

	// 判断是否有信息没有填完整
	meetRequirement() {
		if (this.data.receiverName == '' || this.data.province == '' || this.data.city == '' || this.data.district == '' || this.data.phoneNumber == '' || this.data.detailedAddress == '') {
			return false
		} else {
			return true
		}
	}

})
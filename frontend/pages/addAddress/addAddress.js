const db = wx.cloud.database();
// import areaList from '../../node_modules/@vant/area-data/lib/index';
// import { areaList } from '@vant/area-data';
import areaList from '../../utils/areaList'

Page({

	data: {
		showPopup: false,

		//引入vant的地址列表
		areaList: {},

		//新地址
		receiverName: '',
		province: '',
		city: '',
		district: '',
		phoneNumber: '',
		detailedAddress: '',
		isDefaultAddress: false,
	},

	onLoad: function (options) {
		this.setData({
			areaList: areaList
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

	confirmOverallAddress(e) {
		this.setData({
			showPopup: false,
			province: e.detail.values[0].name,
			city: e.detail.values[1].name,
			district: e.detail.values[2].name,
		})
	},

	changeDefaultAddress(e) {
		this.setData({
			isDefaultAddress: e.detail
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
						name: 'saveNewAddress',
						data: {
							receiverName: this.data.receiverName,
							province: this.data.province,
							city: this.data.city,
							district: this.data.district,
							phoneNumber: this.data.phoneNumber,
							detailedAddress: this.data.detailedAddress,
							isDefaultAddress: this.data.isDefaultAddress,
						}
					}).then(res => {
						wx.hideLoading()
						wx.showToast({
							title: '保存成功',
						}).then(res => {
							wx.navigateBack({
								delta: 1,
							})
						})
					}).catch()
				}
			})
		}else{
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
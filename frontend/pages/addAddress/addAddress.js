const db = wx.cloud.database();

Page({

	/**
	 * 页面的初始数据
	 */
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
		newAddress: {
			receiverName: '',
			province: '',
			city: '',
			district: '',
			phoneNumber: '',
			isDefault: false,
			isDeleted: false
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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

	outOfFocus(e){
		console.log(e)
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
			showPopup:false,
			'newAddress.province':e.detail.values[0],
			'newAddress.city':e.detail.values[1],
			'newAddress.district':e.detail.values[2],
		})
	},

	changeDefaultAddress(e) {
		this.setData({
			'newAddress.isDefault': e.detail
		})
	},

	saveAddress() {
		wx.showModal({
			content: '确认保存地址',
			cancelColor: 'cancelColor',
			confirmColor: "#1ae6e6"
		}).then(res => {
			if (res.confirm == true) {
				const newAddress = this.data.newAddress
				db.collection('t_address').add({
						data: {
							receiverName: newAddress.receiverName,
							province: newAddress.province,
							city: newAddress.city,
							district: newAddress.district,
							phoneNumber: newAddress.phoneNumber,
							isDefault: newAddress.receiverName,
							isDeleted: newAddress.receiverName,
						}
					})
					.then(res => {
						console.log("插入成功")
						console.log(res)
					})
			}
		}).catch()
	}
})
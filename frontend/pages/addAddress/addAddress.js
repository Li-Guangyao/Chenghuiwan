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

		//新地址
		receiverName:'',
		province: '',
		city: '',
		district: '',
		phoneNumber: '',
		detailedAddress:'',
		isDefaultAddress: false,
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
		wx.showModal({
			content: '确认保存地址',
			cancelColor: 'cancelColor',
			confirmColor: "#1ae6e6"
		}).then(res => {
			if (res.confirm == true) {
				if(this.data.isDefaultAddress==true){
					var openId = wx.getStorageSync('openId')
					//如果用户把该地址设为默认的，就把其他的地址取消默认
					db.collection('t_address').where({
						_openid: openId
					})
					.update({
						data:{
							isDefaultAddress: false
						}
					})
					console.log("把其他地址的默认选项都设为false")
				}
				//保存地址到数据库
				db.collection('t_address').add({
						data: {
							receiverName: this.data.receiverName,
							province: this.data.province,
							city: this.data.city,
							district: this.data.district,
							phoneNumber: this.data.phoneNumber,
							detailedAddress: this.data.detailedAddress,
							isDefaultAddress: this.data.isDefaultAddress,
						}
					})
					.then(res => {
						console.log("保存地址成功")
						wx.showModal({
							showCancel:false,
							content:"保存成功",
							confirmText:'确定'
						}).then(res=>{
							wx.navigateBack({
							  delta: 1,
							})
						})
					})
			}
		}).catch()
	}
})
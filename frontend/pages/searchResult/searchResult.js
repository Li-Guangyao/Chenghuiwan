Page({

	data: {
		option1: [
		  { text: '全部商品', value: 0 },
		  { text: '新款商品', value: 1 },
		  { text: '活动商品', value: 2 },
		],
		option2: [
		  { text: '默认排序', value: 'a' },
		  { text: '好评排序', value: 'b' },
		  { text: '销量排序', value: 'c' },
		],
		value1: 0,
		value2: 'a',
		searchKeyWords:'',
		isEmpty: false
	  },


	onLoad: async function (e) {
		this.setData({
			searchKeyWords:e.searchKeyWords
		})

		wx.showLoading({
			title: '搜索中',
		})
		
		await wx.cloud.callFunction({
			name: 'searchPost',
			data:{
				searchKeyWords: e.searchKeyWords
			}
		}).then(res=>{
			this.setData({
				postList: res.result.data
			})
		})

		this.judgeIsEmpty()

		wx.hideLoading({})
		
	},

	judgeIsEmpty(){
		if(this.data.postList.length==0){
			this.setData({
				isEmpty: true
			})
		}else{
			this.setData({
				isEmpty: false
			})
		}
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

	}
})
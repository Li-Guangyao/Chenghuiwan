const db = wx.cloud.database()

Page({

    data: {
        swiperList:[],
        goodsList:[],
        keyWords: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        db.collection('t_mall_swiper').get().then(res=>{
            this.setData({
                swiperList: res.data
            })
        })

        // 从数据库中随机获取商品，展示到前端
        wx.cloud.callFunction({
            name: 'getRandomGoods'
        }).then(res=>{
            console.log(res.result)
            this.setData({
                goodsList: res.result
            })
        })

	},

    onReady: function () {
        //获取全部分类列表，并保存到storage，当用户点击分类列表时，减少等待时间
        wx.cloud.callFunction({
			name: 'getGoodsCate',
		}).then(res => {
			console.log(res)
			wx.setStorageSync('firstLevelCate', res.result.firstLevelCate)
			wx.setStorageSync('goodsCateTrans', res.result.goodsCateTrans)				
		})
    },

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

    searchGoods(){
        wx.navigateTo({
          url: '../goodsList/goodsList?keyWords='+ this.data.keyWords,
        })
    }
})
const db = wx.cloud.database()

Page({

    data: {
        swiperList:[],
        goodsList:[]
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

        // wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     // url: 'https://www.fastmock.site/mock/6a7cf8cb5c42cda6181f1696b06383cc/test/api/public/v1/home/swiperdata',
        //     success: (res) => {
        //         this.setData({
        //             swiperList: res.data.message
        //         })
        //         console.log(this.data.swiperList)
        //     }
        // })

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
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

    searchGoods(e){
        console.log(e);
        wx.navigateTo({
          url: '../goodsList/goodsList',
        })
    }
})
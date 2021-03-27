// pages/mall/mall.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.request({
            url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
            // url: 'https://www.fastmock.site/mock/6a7cf8cb5c42cda6181f1696b06383cc/test/api/public/v1/home/swiperdata',
            success: (res) => {
                this.setData({
                    swiperList: res.data.message
                })
                console.log(this.data.swiperList)
            }
        })
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

    searchGoods(e){
        console.log(e);
        wx.navigateTo({
          url: '../goodsList/goodsList',
        })
    }
})
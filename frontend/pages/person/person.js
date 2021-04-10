const db = wx.cloud.database()

Page({

    data: {
        userInfo: wx.getStorageSync('userInfo'),
        postList: []
    },

    queryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 显示加载中提示框
        wx.showLoading({
          title: '加载中',
        })
        
        const openId = wx.getStorageSync('openId')
        db.collection('t_post').where({
            _openid: openId
        }).get().then(e => {
            console.log(e)
            this.setData({
                postList: e.data
            })
        })

        //关闭加载中提示框
        wx.hideLoading({
          success: (res) => {},
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.log('person页面触底')
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    chosePost: function(e) {
        console.log(e)
    }
})
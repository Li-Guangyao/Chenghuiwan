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

    onLoad: function(options) {

        wx.cloud.callFunction({
            name: 'getuser',
            data: {
                openId: this.data.userInfo._openid
            }
        }).then(res=>{
            this.setData({
                userInfo: res.res.data
            })
        })
        
        wx.cloud.callFunction({
            name: 'getPost'
        }).then(res=>{
            this.setData({
                postList: res.result.data
            })
        })

    },

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
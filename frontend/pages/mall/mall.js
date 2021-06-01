const db = wx.cloud.database()

Page({
    data: {
        swiperList: [],
        goodsList: [],
        keyWords: ''
    },

    queryParams: {
        pageNum: 0,
        pageSize: 20
    },

    onLoad: function (options) {

        db.collection('t_mall_swiper').get().then(res => {
            this.setData({
                swiperList: res.data
            })
        })

        this.getGoods()
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

    // 从数据库中随机获取商品，展示到前端
    getGoods() {
        this.queryParams.pageNum = 0
        wx.cloud.callFunction({
            name: 'getRandomGoods'
        }).then(res => {
            console.log(res.result)
            this.setData({
                goodsList: res.result
            })
        })
    },

    onPullDownRefresh: function () {
        this.getGoods()
        wx.stopPullDownRefresh()
    },

    onReachBottom: function () {
        this.queryParams.pageNum++
        wx.cloud.callFunction({
            name: 'getRandomGoods',
            data: {
                skipNum: this.queryParams.pageNum * this.queryParams.pageSize,
            }
        }).then(res => {
            console.log(res)
            if (res.result.length == 0) {
                // wx.showToast({
                //     icon: 'error',
                //     title: '没有更多了~',
                // })
            } else {
                var subPostList = res.result
                this.set
                Data({
                    postList: [...this.data.postList].concat(...subPostList)
                })
            }
        })
    },

    searchGoods() {
        wx.navigateTo({
            url: '../goodsList/goodsList?keyWords=' + this.data.keyWords,
        })
    }
})
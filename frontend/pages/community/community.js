Page({
    data: {
        tabbar: [{
                id: 0,
                name: "我的关注",
                isChosen: true
            },
            {
                id: 1,
                name: "本地动态",
                isChosen: false
            }
        ],
        chosenTabIndex: 0,
        swiperHeight: 0,

        followedPostList: [],
        localPostList: [],

        latitude: null,
        longitude: null
    },

    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    swiperHeight: res.windowHeight
                })
            }
        })
        this.getPost()
    },

    async getPost() {
        wx.showLoading({
            title: '加载中',
        })

        await wx.cloud.callFunction({
            name: 'getFollowedPost'
        }).then(res => {
            this.setData({
                followedPostList: res.result.followedPostList
            })
        })

        wx.hideLoading()
    },

    async getNearPost() {
        wx.showLoading({
          title: '加载中',
        })

        wx.getLocation({
            success: res => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })

                wx.cloud.callFunction({
                    name: 'getNearPost',
                    data:{
                        latitude: res.latitude,
                        longitude: res.longitude
                    }
                }).then(res=>{
                    console.log(res)
                    this.setData({
                        localPostList: res.result.data
                    })
                })
            },
            fail: res => {
                if (res.errMsg == "chooseLocation:fail auth deny") {
                    wx.showModal({
                        title: '点击右上角，授权获取位置信息',
                        showCancel: true,
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting()
                            }
                        }
                    })
                } else {}
            }
        })

        wx.hideLoading()
    },

    onPullDownRefresh() {
        this.getPost()
        wx.stopPullDownRefresh()
    },

    // 点击改变
    handleTabbarChange(e) {
        //获取点击的tabbar项下标
        const chosenTabIndex = e.detail.index;
        let tabbar = this.data.tabbar;
        //根据获取的下表，改变tabbar
        tabbar.forEach((v, i) => i === chosenTabIndex ? v.isChosen = true : v.isChosen = false);
        this.setData({
            tabbar,
            chosenTabIndex
        });
    },

    // 滑动改变
    handleSwiperChange: function (e) {
        var chosenTabIndex = e.detail.current
        let tabbar = this.data.tabbar;
        //根据获取的下表，改变tabbar
        tabbar.forEach((v, i) => i === chosenTabIndex ? v.isChosen = true : v.isChosen = false);
        this.setData({
            tabbar,
            chosenTabIndex
        })
        if (chosenTabIndex == 1) {
            this.getNearPost()
        }
    }

})
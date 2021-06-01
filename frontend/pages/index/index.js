Page({
    data: {
        tabs: ["推荐", "数码", "ACG", "玩具", "美术", "乐器", "运动", "手工", "生活", "其他"],
        keys: ["random", "digit", "ACG", "toy", "art", "music", "sport", "craft", "life", "others"],
        chosenTabIndex: 0,
        tabWidth: 0,
        scrollLeft: 0,
        swiperHeight: 0,

        postList: {},
    },

    queryParams: {
		pageNum: 0,
		pageSize: 20
	},

    onLoad: function () {
        wx.getSystemInfo({
            success: (res) => {
                var tabWidth = res.windowWidth / 4.5; //设置tab的宽度
                this.setData({
                    tabWidth: tabWidth,
                    swiperHeight: res.windowHeight
                })
            }
        })

        this.getPost()
    },

    // 从服务器获得帖子
    getPost() {
        this.queryParams.pageNum = 0

        wx.cloud.callFunction({
            name: 'getRandomPost',
        }).then(res => {
            console.log(res)
            this.setData({
                'postList.random': res.result
            })
        })
    },

    // 触底加载
    async onReachBottom() {
		wx.showLoading({
			title: '加载中',
		})

		this.queryParams.pageNum++
		await wx.cloud.callFunction({
			name: 'getRandomPost',
			data: {
				skipNum: this.queryParams.pageNum * this.queryParams.pageSize,
				newestDate: this.data.postList.random[0].createdAt
			}
		}).then(res => {
			if (res.result.length == 0) {
				wx.showToast({
					icon: 'error',
					title: '没有更多了~',
				})
			} else {
				this.setData({
					fileList: [...this.data.fileList].concat(...res.result)
				})
			}
		})

		wx.hideLoading()        
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        this.getPost()
		wx.stopPullDownRefresh()
    },

    // 点击tab某个选项
    handleTabTap: function (e) {
        this.changeSwiper(e.currentTarget.dataset.index)
    },

    // 滑动改变swiper某个选项
    handleSwiperChange: function (e) {
        this.changeSwiper(e.detail.current)
    },

    async changeSwiper(chosenTabIndex) {
        this.setData({
            chosenTabIndex: chosenTabIndex,
            scrollLeft: (chosenTabIndex - 2) * this.data.tabWidth
        })

        var chosenTabName = this.data.keys[chosenTabIndex]
        if (chosenTabIndex == 0) {} else {
            await wx.cloud.callFunction({
                name: 'getCatedPost',
                data: {
                    cateName: chosenTabName
                }
            }).then(res => {
                var item = 'postList.' + chosenTabName
                console.log(item)
                this.setData({
                    [item]: res.result.data
                })

            })
        }

    }

})
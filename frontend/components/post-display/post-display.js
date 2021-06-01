Component({
    properties: {
        postList: {
            type: Array,
            value: []
        },

        getMode: {
            type: Array,
            value: [{
                modeName: 'getSelfPost'
            }]
        }
    },

    data: {

    },

    methods: {
        chosePost(e) {
            console.log(e)
        },

        // fillData(listData) {
        //     for (var i = 0, len = listData.length; i < len; i++) {
        //         //根据底部下单区域的高矮，来初始化页面的大小
        //         var query = wx.createSelectorQuery()
        //         query.select('.fixed-region').boundingClientRect()
        //         query.exec(res => {
        //             this.setData({
        //                 pageHeight: res[0].top
        //             })
        //         })
        //     }
        // }
    }
})
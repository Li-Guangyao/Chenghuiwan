const db = wx.cloud.database()

//获取标准的时间格式yyyy-mm-dd hh:mm，而非时间戳
import date from '../../utils/date'
import judgeImageFormat from '../../utils/judgeImageFormat'
import uploadImage from '../../utils/uploadImage'

Page({
    data: {
        title: '',
        content: '',
        location: null,
        topic: [],
        fileList: [],
    },

    onLoad() {
        console.log('onload')
        //根据底部下单区域的高矮，来初始化页面的大小
        var query = wx.createSelectorQuery()
        query.select('.fixed-region').boundingClientRect()
        query.exec(res => {
            this.setData({
                pageHeight: res[0].top
            })
        })

        // var post = wx.getStorageSync('post')
        // if (post) {
        //     this.setData({
        //         title: post.title,
        //         content: post.content,
        //         fileList: post.fileList
        //     })
        // } else {}
    },

    onHide() {
        // console.log('oHide')
        // wx.setStorage({
        //     key: "post",
        //     data: {
        //         title: this.data.title,
        //         content: this.data.content,
        //         fileList: this.data.fileList
        //     }
        // })
    },

    contentInput(e) {
        this.setData({
            content: e.detail.value
        })
    },

    // 获得定位
    getLocation() {
        wx.chooseLocation({
            success: res => {
                if (res.name) {
                    this.setData({
                        location: res
                    })
                } else {
                    // 用户没有选择一个地址，所以没有具体的地名
                }
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
                } else {
                    // 可能是点击了取消按钮，所以获取失败
                }
            }
        })
    },

    // 去除这个位置信息
    removeLocation() {
        this.setData({
            location: null
        })
    },

    // upload选择完会触发这个函数，把所有选择的图片生成临时地址
    chosenImage(e) {
        console.log(e)

        const openId = wx.getStorageSync('openId')
        var fileList = e.detail.file
        var oldArrayLength = this.data.fileList.length
        var newArrayLength = fileList.length

        for (var i = oldArrayLength, len = oldArrayLength + newArrayLength; i < len; i++) {
            // 曾经幻想保存每一个图片的高度信息，便于post-display组件设置高度排版
            // wx.getImageInfo({
            //     src: fileList[i].url,
            //     success(res) {
            //         console.log(res)
            //     }
            // })

            var item = 'fileList[' + i + ']'
            var imageFormat = judgeImageFormat(fileList[i - oldArrayLength].url)
            this.setData({
                [item]: {
                    url: fileList[i - oldArrayLength].url,
                    name: openId + '-' + Date.now() + '-' + i + '.' + imageFormat,
                    isImage: true,
                }
            })
        }
    },

    //删除点击的图片
    removeImage(e) {
        this.data.fileList.splice(e.detail.index, 1)
        this.setData({
            fileList: this.data.fileList
        })
    },

    //editor组件无法使用model:value来直接修改，所以需要使用DOM来操作
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('.content-input').context(function (res) {
            that.editorCtx = res.context
        }).exec()
    },

    //editor组件无法使用model:value来直接修改，所以需要使用DOM来操作
    clearContentExecute() {
        this.setData({
            title: '',
            content: '',
            location: '',
            topic: [],
            fileList: [],
        })

        // 清除editor组件内容
        // this.editorCtx.clear({
        // 	success: function (res) {
        // 		console.log("clear success")
        // 	}
        // })
    },

    clearContent() {
        wx.showModal({
            content: '确定要清空吗？',
            success: e => {
                if (e.confirm) {
                    // 用户点击了确定 可以调用删除方法了
                    this.clearContentExecute()
                } else if (e.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    publishPost() {
        if (this.data.title == '') {
            wx.showToast({
                title: '标题不能为空！',
                icon: 'none'
            });
        } else if (this.data.fileList.length == 0) {
            wx.showToast({
                title: '至少选择一张图片！',
                icon: 'none'
            });
        } else {
            wx.showModal({
                content: '确定要发布吗？',
                success: async (e) => {
                    if (e.confirm) {
                        wx.showLoading({
                            title: '发布中',
                        })

                        // 用户点击了确定
                        var uploadedFileList = await uploadImage(this.data.fileList, 'postPhoto')
                        console.log(uploadedFileList)
                        await wx.cloud.callFunction({
                            name: 'saveNewPost',
                            data: {
                                title: this.data.title,
                                content: this.data.content,
                                postPhoto: uploadedFileList,
                                location: this.data.location,
                            }
                        }).catch()

                        setTimeout(() => {
                            wx.showToast({
                                title: '发布成功',
                                icon: "success",
                            });

                            setTimeout(() => {
                                wx.hideToast();
                            }, 2000)
                        }, 0);

                        // 保存内容之后删除该页的数据
                        this.clearContentExecute()

                        wx.hideLoading({
                          success: (res) => {},
                        })
                        
                    } else if (e.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    }
});
//index.js
const app = getApp()

Page({
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('myVideo')
    },
    data: {
        myResume: '',
        myQr: ''
    },
    getQr: function () {
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.getTempFileURL({
            fileList: ['cloud://huyongheshu-18aeb9.6875-huyongheshu-18aeb9/PQrwx.jpg',], // 文件 ID
            success: res => {
                wx.hideLoading();
                if (!res.fileList[0].status) {
                    this.setData({
                        myQr: res.fileList[0].tempFileURL
                    })
                }
            },
            fail: () => {
                wx.hideLoading();
                console.error
            }
        })
    },
    getResume: function () {
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.downloadFile({
          fileID: 'cloud://huyongheshu-18aeb9.6875-huyongheshu-18aeb9/胡永--男--应聘前端工程师.pdf',
            success(res) {
                const filePath = res.tempFilePath
                wx.openDocument({
                    filePath,
                    success(res) {
                        wx.hideLoading();
                    }
                })
            }
        })
    },
    bindPlay: function () {
        this.videoContext.play()
    },
    bindPause: function () {
        this.videoContext.pause()
    },
    preview: function () {
        wx.previewImage({
            current: this.data.myQr,
            urls: [this.data.myQr]
        })
    },
    onLoad: function () {
    },






})

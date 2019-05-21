

const app = getApp()

Page({
    data: {
        fileID: '',
        cloudPath: '',
        imagePath: '',
        time: '',
    },
    //格式化时分秒
    formatMinSec(params) {
        return params < 10 ? '0' + params : params;
    },
    formatTime(params) {
        let nowTime = params;
        const hour = this.formatMinSec(nowTime.getHours());
        const min = this.formatMinSec(nowTime.getMinutes());
        const sec = this.formatMinSec(nowTime.getSeconds());
        let time = hour + ':' + min + ':' + sec;
        return time;
    },
    // 点击打卡按钮
    onTap() {
        wx.showLoading({
            title: '加载中',
        })
        let nowTime = new Date();
        this.formatTime(nowTime);
        new Promise((resolve, reject) => { resolve() })
            .then(this.storePunchOutTime(nowTime))
            .then(this.punchOutNum()).then(
                this.setData({
                    time: this.formatTime(nowTime),
                    punchOut: true
                })
            );

    },
    // 获取打卡次数
    async punchOutNum() {
        const db = wx.cloud.database()
        const _ = db.command
        const appid = wx.cloud.callFunction({
            name: 'login',
        }).then(res => {
            return res.result.appid;
        })
        await db.collection('punchOut').where({
            _openid: appid
        })
            .count().then(res => {
                wx.hideLoading(),
                this.setData({
                    punchOutNum: res.total,
                })
            }
            )
    },
    // 判断是否打卡了
    async judgePunchOut() {
        wx.showLoading({
            title: '加载中',
        })
        const db = wx.cloud.database()
        const _ = db.command
        const timeStamp = new Date().setHours(0, 0, 0, 0) / 1000;
        await db.collection('punchOut').where({
            time: _.gt(timeStamp)
        })
            .get().then(res => {
                if (res.data.length > 0) {
                    this.setData({
                        punchOutOrNot: res.data.length,
                        time: this.formatTime(new Date(res.data[0].time * 1000))
                    })
                } else {
                    this.setData({
                        punchOutOrNot: res.data.length,
                    })
                }

            }
            ).then(this.punchOutNum());

    },
    // 存储打卡时间
    storePunchOutTime: function (nowTime) {
        const db = wx.cloud.database()
        db.collection('punchOut').add({
            data: {
                time: Date.parse(nowTime) / 1000,
            }
        }).then(res => {
        })
    },

    onLoad: function (options) {
        this.judgePunchOut();
    },
})
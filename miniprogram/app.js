//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '有新功能哦',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '重新打开小程序提示',
        content: '恭喜你找到了一个程序猿也没找到的bug！',
      })
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})

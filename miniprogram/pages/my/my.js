//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
  },

  goTodevInfo: function () {
    wx.navigateTo({
      url: '/pages/devInfo/devInfo'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
  })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.hideLoading()
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },






})

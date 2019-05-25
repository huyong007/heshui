//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    habitList: [
    ],
    time: [],
    showModal: true,
    fisrstDay: '',
    secondDay: '',
    thirdDay: '',
    fourthDay: '',
    fifthDay: '',
    firstDate: '',
    secondDate: '',
    thirdDate: '',
    fourthDate: '',
    fifthDate: '',
  },

  // 获取数据库习惯列表

  getDatabaseHabitList: function () {
    let habitList = [];

    const appid = wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      return res.result.appid;
    })
    const db = wx.cloud.database()
    db.collection('habit').where({
      _openid: appid
    }).get().then(res => {
      const database = res.data;
      database.map(e => {
        habitList.push(e.habit);
      })
      this.setData({
        habitList: habitList
      })
    })

  },


  // 生成时间
  generateDay: function () {
    this.setData({
      firstDate: new Date().getDate(),
      secondDate: new Date(Date.parse(new Date()) - 86400 * 1000).getDate(),
      thirdDate: new Date(Date.parse(new Date()) - 86400 * 2000).getDate(),
      fourthDate: new Date(Date.parse(new Date()) - 86400 * 3000).getDate(),
      fifthDate: new Date(Date.parse(new Date()) - 86400 * 4000).getDate(),
      'time.[0].time': new Date() / 1000,
      'time.[1].time': new Date(Date.parse(new Date()) - 86400 * 1000) / 1000,
      'time.[2].time': new Date(Date.parse(new Date()) - 86400 * 2000) / 1000,
      'time.[3].time': new Date(Date.parse(new Date()) - 86400 * 3000) / 1000,
      'time.[4].time': new Date(Date.parse(new Date()) - 86400 * 4000) / 1000,


    })

  },
  // 打卡 点击checkbox
  checkboxChange: function (e) {

    // wx.showLoading({
    //   title: '加载中',
    // })
    const checkouthabit = [];
    for (var i = 0; i < e.detail.value.length; i++) {
      var aaa = e.detail.value[i].split(',');
      const item = {};
      item.name = aaa[0];
      item.id = aaa[1];
      checkouthabit.push(item)
    }
    console.log(checkouthabit);
    checkouthabit.forEach(e => {
      this.updateHabitCheckout(e);
    });

  },

  // 更新数据库
  async updateHabitCheckout(param) {
    const db = wx.cloud.database()
    const _ = db.command;
    const updateHabit = [];
    await db.collection('habit').where(
      {
        habit: {
          name: _.eq(param.name)
        }
      }
    )
      .get().then(res => {
        updateHabit = res.data;
        console.log(updateHabit, 'updateHabit1');
        updateHabit[0].habit.time.forEach(v => {
          if (v.id === param.id) {
            v.checked = true;
          }
        })
        console.log(updateHabit, 'updateHabit2');
      })


  },

  // 新建习惯模态框
  handleShowModal: function () {
    this.setData({
      showModal: !this.data.showModal
    })
  },
  // 阻止冒泡关闭模态框
  catchEvent: function () {
    console.log('阻止冒泡');
  },


  //新建习惯模态框提交
  formSubmit: function (e) {
    if (!e.detail.value.habitTitle) {
      this.setData({
        warning: !this.data.showModal
      })
      wx.showModal({
        content: '习惯名称必填',
        showCancel: false,
        confirmColor: 'red'
      })
      return;
    }
    this.handleShowModal();
    this.storeNewHabit(e.detail.value.habitTitle);
  },

  // 调用云函数 存储新建的习惯进入 custom 数据库
  storeNewHabit: function (customName) {
    console.log(1);
    wx.cloud.callFunction({
      name: 'newCustom',
      data: {
        customName:customName
      },
    })
      .then(res => {
        wx.showModal({
          title: '提示',
          content: '新建习惯成功'
        });
        console.log(res.result) // 3
      })
      .catch(console.error)
  },


  // 模态框重置
  formReset: function () {
    this.handleShowModal();
  },

  onLoad: function () {
    let self = this;
    self.generateDay();
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
          this.getDatabaseHabitList();
        } else {
          wx.hideTabBar({
            success: res => {
              console.log('隐藏ta btabBar');
            }
          });
          self.setData({
            logged: true
          })
        }
      }
    })

  },


  switchTap: function () {
    wx.switchTab({
      url: '/pages/punchOut/punchOut',
    })
  },


  bindGetUserInfo: function (e) {
    this.setData({
      logged: false,
      avatarUrl: e.detail.userInfo.avatarUrl,
      userInfo: e.detail.userInfo
    });
    this.getDatabaseHabitList();
    wx.showTabBar({
      success: res => {
        console.log('显示tabtabBar');
      }
    });
  }


})

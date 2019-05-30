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
    addRecordImgBtn: '../../assets/images/addRecordText.png',
    inputRecord: '',
    recordArray: ['冥想', '自学', '自学', '工作', '读书'],
    submitDisabled: true,

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
    console.log(e, 'formsubmit 提交按钮')
    let recordArray = this.data.recordArray;
    console.log(recordArray, 'recordArray');
    this.setData({
      recordArray: recordArray,
    })

    recordArray.push(this.data.inputRecord);
    // wx.setStorage('recordArray','recordArray');

    this.setData({
      recordArray: recordArray,
      addRecordImgBtn: '../../assets/images/addRecordText.png'
    })
    this.handleShowModal();
    this.post_record(e.detail.value.record);
  },

  // 输入框键盘事件开始输入:
  bindKeyInput: function (e) {
    if (e.detail.value) {
      this.setData({
        addRecordImgBtn: '../../assets/images/addRecordTexted.png',
        inputRecord: e.detail.value,
        submitDisabled: false,
      })
    } else {
      this.setData({
        addRecordImgBtn: '../../assets/images/addRecordText.png',
        submitDisabled:true,
      })
    }

  },


  // 调用云函数 存储新建的记录项到数据库
  post_record: function (customName) {
    console.log(1);
    wx.cloud.callFunction({
      name: 'post_record',
      data: {
        record: record
      },
    })
      .then(res => {
        wx.showModal({
          title: '提示',
          content: '新建习惯成功'
        });
        console.log(res.result) // 3
        this.get_record();
      })
      .catch(console.error)
  },

    // 获取数据库习惯列表

    get_record: function () {
      console.log('get');
      wx.cloud.callFunction({
        name: 'get_record',
        data: {
          recordQuantity: 'all'
        },
      })
        .then(res => {
        this.recordArray = res.result;
          console.log(res.result,'res.result') // 3
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
          this.get_record();
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


// const cloud = require('wx-server-sdk')

// cloud.init()
// const db = cloud.database()
// exports.main = async (event, context) => {
//   const customName = event.customName
//   const i = 0
//   console.log(customName, 'customName');
//   try {
//     return await db.collection('custom').add({
//       // data 字段表示需新增的 JSON 数据
//       data: {
//         name: customName,
//         remark: '',
//         creat_time: new Date() / 1000,
//         update_time: new Date() / 1000,
//         _id: i++
//       }
//     })
//   } catch (e) {
//     console.log(e)
//   }
// }
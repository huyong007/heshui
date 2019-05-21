// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = wx.cloud.database()

  db.collection('attend').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      description: 'learn cloud database',
      due: new Date('2018-09-01'),
      tags: [
        'cloud',
        'database'
      ],
      location: new db.Geo.Point(113, 23),
      done: false
    }
  })
    .then(res => {
      console.log(res)
    })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
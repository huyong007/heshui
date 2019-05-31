// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  let { userInfo, listQuantity} = event
  let { OPENID, APPID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  let sum = listQuantity
  const wxContext = cloud.getWXContext()
  let recordList = '111';
  const db = cloud.database();
  console.log('db');
  await db.collection('record').where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    const database = res.data;
    database.map(e => {
      recordList.push(e.habit);
    })

  })
  return {
    OPENID,
    APPID,
    sum,
    recordList
  }
}
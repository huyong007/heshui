// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database();
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let recordList = [];

  console.log('db');
  await db.collection('record').where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    const database = res.data;
    database.map(e => {
      recordList.push(e.habit);
    })
    return recordList;
  })
}
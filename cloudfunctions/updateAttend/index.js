// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('habit').where({
      time: _.neq(0)
    }).remove()
  } catch (e) {
    console.error(e)
  }
}
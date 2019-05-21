const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  const customName = event.customName
  const i = 0
  console.log(customName, 'customName');
  try {
    return await db.collection('custom').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: customName,
        remark: '',
        creat_time: new Date() / 1000,
        update_time: new Date() / 1000,
        _id: i++
      }
    })
  } catch (e) {
    console.log(e)
  }
}
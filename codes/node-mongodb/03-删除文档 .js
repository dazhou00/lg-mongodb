const { MongoClient } = require("mongodb");

// 连接地址
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function run() {
  try {
    // 开始连接
    await client.connect();

    const testDb = client.db("test");
    const inventory = testDb.collection("inventory");

    // 删除第一个匹配得文档
    const deleteResult = await inventory.deleteOne({ name: "Grandma pizza" });

    // 删除多个文档
    const deleteResult = await inventory.deleteMany({ name: "Grandma pizza" });

    console.log(deleteResult.deletedCount);
  } catch (e) {
    console.log("连接失败", e);
  } finally {
    // 最后关闭连接
    await client.close();
  }
}

run();

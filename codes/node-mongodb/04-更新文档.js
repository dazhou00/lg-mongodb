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

    // 更新匹配得第一个文档
    await inventory.updateOne({ status: "A" }, { $set: { z: 10 } });

    // 更新多个文档
    await inventory.updateMany({ status: "P" }, { $set: { z: 10 } });

    // 替换文档
    await inventory.replaceOne({ status: "D" }, { z: 100 });
  } catch (e) {
    console.log("连接失败", e);
  } finally {
    // 最后关闭连接
    await client.close();
  }
}

run();

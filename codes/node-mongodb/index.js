const { MongoClient } = require("mongodb");

// 连接地址
const uri = "mongodb://127.0.0.1:27017";

// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function run() {
  try {
    // 开始连接
    await client.connect();
    console.log("连接成功");

    const testDb = client.db("test");
    const inventoryCollection = testDb.collection("inventory");
    const ret = await inventoryCollection.find();

    console.log(await ret.toArray());
  } catch (e) {
    console.log("连接失败");
  } finally {
    // 最后关闭连接
    await client.close();
  }
}

run();

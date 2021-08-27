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

    const find = await inventory.find();

    console.log(await find.toArray());
  } catch (e) {
    console.log("连接失败", e);
  } finally {
    // 最后关闭连接
    await client.close();
  }
}

run();

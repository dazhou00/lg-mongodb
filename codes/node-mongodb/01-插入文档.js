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

    // 创建文档
    // const document = {
    //   name: "Neapolitan pizza",
    //   shape: "round",
    //   toppings: ["San Marzano tomatoes", "mozzarella di bufala cheese"],
    // };
    // const ret = await inventory.insertOne(document);

    const documents = [
      { name: "Sicilian pizza", shape: "square" },
      { name: "New York pizza", shape: "round" },
      { name: "Grandma pizza", shape: "square" },
    ];

    const ret = await inventory.insertMany(documents);

    console.log(ret);
  } catch (e) {
    console.log("连接失败", e);
  } finally {
    // 最后关闭连接
    await client.close();
  }
}

run();

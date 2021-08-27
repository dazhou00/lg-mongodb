# 在 Node.js 中操作 MongoDB

- 在服务端操作 MongoDB：https://docs.mongodb.com/drivers/
- 在 Node.js 中操作 MongoDB：https://docs.mongodb.com/drivers/node/


## 连接到 MongoDB

```js
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

```

## CRUD 操作

### 创建文档(Create)

- 插入一个文档

```js
  await client.connect();

  const testDb = client.db("test");
  const inventory = testDb.collection("inventory");

  const document = {
    name: "Neapolitan pizza",
    shape: "round",
    toppings: ["San Marzano tomatoes", "mozzarella di bufala cheese"],
  };
  const ret = await inventory.insertOne(document);
```

- 插入多个文档

```js
  const testDb = client.db("test");
  const inventory = testDb.collection("inventory");

  const documents = [
    { name: "Sicilian pizza", shape: "square" },
    { name: "New York pizza", shape: "round" },
    { name: "Grandma pizza", shape: "square" },
  ];

  const ret = await inventory.insertMany(documents);
```

### 查询文档(Read)

```js
  await client.connect();

  const testDb = client.db("test");
  const inventory = testDb.collection("inventory");

  const find = await inventory.find();
```

### 删除文档(Delete)

```js
  await client.connect();

  const testDb = client.db("test");
  const inventory = testDb.collection("inventory");

  // 删除第一个匹配得文档
  const deleteResult = await inventory.deleteOne({ name: "Grandma pizza" });

  // 删除多个文档
  const deleteResult = await inventory.deleteMany({ name: "Grandma pizza" });
```


### 修改文档(Update)

- 更新文档

```js
  await client.connect();

  const testDb = client.db("test");
  const inventory = testDb.collection("inventory");

  // 更新匹配得第一个文档
  await inventory.updateOne({ status: "A" }, { $set: { z: 10 } });

  // 更新多个文档
  await inventory.updateMany({ status: "P" }, { $set: { z: 10 } });
```

- 替换文档

```js
  await client.connect();

  const testDb = client.db("test");
  const inventory = testDb.collection("inventory");

  await inventory.replaceOne({ status: "D" }, { z: 100 });
```
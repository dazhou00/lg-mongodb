const express = require("express");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });

const app = express();

// 配置解析请求体数据 application/json
// 它会把解析到的请求体数据放到 req.body 中
// 注意：一定要在使用之前就挂载这个中间件
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello MongoDB");
});

// 创建文章
app.post("/articles", async (req, res, next) => {
  try {
    // 获取表单数据
    const { article } = req.body;

    // 验证数据
    if (!article || !article.title || !article.description || !article.body) {
      return res.status(422).json({
        error: "请求参数不符合规则要求",
      });
    }

    //把验证通过的数据插入数据库中
    await client.connect();
    const collection = client.db("test").collection("articles");

    article.createAt = new Date();
    article.updateAt = new Date();

    const ret = await collection.insertOne(article);

    article._id = ret.insertedId;

    res.status(201).json({ article });
  } catch (err) {
    // 由错误处理中间件统一处理
    next(err);
    // res.status(500).json({
    //   error: err.message
    // })
  }
});

// 获取文章列表
app.get("/articles", async (req, res, next) => {
  try {
    let { _page = 1, _size = 10 } = req.query;
    _page = Number.parseInt(_page);
    _size = Number.parseInt(_size);

    await client.connect();
    const collection = client.db("test").collection("articles");
    const ret = await collection
      .find()
      .skip((_page - 1) * size) // 跳过多少条
      .limit(_size); // 取多少条

    const articles = await ret.toArray();
    const articlesCount = await collection.countDocuments();
    res.status(200).json({
      articles,
      articlesCount,
    });
  } catch (err) {
    next(err);
  }
});

// 获取单个文章
app.get("/articles/:id", (req, res) => {
  res.send("get /articles/:id");
});

// 更新文章
app.patch("/articles/:id", (req, res) => {
  res.send("patch /articles/:id");
});

// 删除文章
app.delete("/articles/:id", (req, res) => {
  res.send("delete /articles/:id");
});

app.listen(3000, () => {
  console.log("启动成功，监听：http://localhost:3000");
});

# MongoDB 数据库结合 Web 服务

## 接口设计

- [理解 RESTful 架构](http://www.ruanyifeng.com/blog/2011/09/restful.html)
- [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

### 创建文章

- 请求方法 POST
- 请求路径 /articles
- 请求参数 Body
  - title、description、body、tagList
- 数据格式 application/json

请求示例：

```js
{
  article:{
    title: '文章标题',
    description: '文章描述',
    body: '文章内容',
    tagList: [ 'reactjs', 'angularjs', 'drangons']
  }
}
```

返回数据示例:

- 状态码 201
- 响应数据

```js
{
  article:{
    _id: 123
    title: '文章标题',
    description: '文章描述',
    body: '文章内容',
    tagList: [ 'reactjs', 'angularjs', 'drangons'],
    createAt: '2021-08-27T03:22:56.637Z',
    updateAt: '2021-08-27T08:48:35.824Z'
  }
}
```

### 获取文章列表

- 请求方法 GET
- 请求路径 /articles
- 请求参数 (Query)
  - \_page 页码
  - \_size 每页条数

响应数据示例：

- 状态码 200
- 响应数据

```js
{
  articles:[
    {
      _id: 123
      title: '文章标题',
      description: '文章描述',
      body: '文章内容',
      tagList: [ 'reactjs', 'angularjs', 'drangons'],
      createAt: '2021-08-27T03:22:56.637Z',
      updateAt: '2021-08-27T08:48:35.824Z'
    },
    {
      _id: 456
      title: '文章标题',
      description: '文章描述',
      body: '文章内容',
      tagList: [ 'reactjs', 'angularjs', 'drangons'],
      createAt: '2021-08-27T03:22:56.637Z',
      updateAt: '2021-08-27T08:48:35.824Z'
    },
  ],
  articlesCount: 2
}
```

### 获取单个文章

- 请求方法 GET
- 请求路径 /articles/:id

响应数据示例

- 状态码 200
- 响应数据

```js
{
  article:{
    _id: 123
    title: '文章标题',
    description: '文章描述',
    body: '文章内容',
    tagList: [ 'reactjs', 'angularjs', 'drangons'],
    createAt: '2021-08-27T03:22:56.637Z',
    updateAt: '2021-08-27T08:48:35.824Z'
  }
}
```

### 更新文章

- 请求方法 PATCH
- 请求路径 /articles/:id
- 请求参数 (Body)
  - title、description、body、tagList

请求示例：

```js
{
  article: {
    title: "更新标题";
  }
}
```

响应数据示例：

- 状态码 201
- 响应数据

```js
{
  article:{
    _id: 123
    title: '更新标题',
    description: '文章描述',
    body: '文章内容',
    tagList: [ 'reactjs', 'angularjs', 'drangons'],
    createAt: '2021-08-27T03:22:56.637Z',
    updateAt: '2021-08-27T08:48:35.824Z'
  }
}
```

### 删除文章

- 请求方法 DELETE
- 请求路径 /articles/:id

响应数据示例：

- 状态码 204
- 响应数据

```js
{
}
```

## 项目准备

```powershell
# 创建项目目录
mkdir article-mongodb

# 进入项目目录
cd article-mongodb

# 初始化项目
npm init -y

# 安装项目依赖
npm install express mongodb
```

### 使用 express 创建 web 服务

```js
const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello MongoDB");
});

app.listen(3000, () => {
  console.log("启动成功，监听：http://localhost:3000");
});
```

### 路由设计

```js
// 创建文章
app.post("/articles", (req, res) => {
  res.send("post /articles");
});

// 获取文章列表
app.get("/articles", (req, res) => {
  res.send("get /articles");
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
```

### 处理 body 请求数据

```js
// 配置解析请求体数据 application/json
// 它会把解析到的请求体数据放到 req.body 中
// 注意：一定要在使用之前就挂载这个中间件
app.use(express.json());
```

## 创建文章

```js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });
```

```js
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
```

```js
// 它之前的所有路由中调用 next(err) 就会进入这里
// 注意： 4个参数，缺一不可
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
  });
});
```

### 获取文章列表

```js
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
      .skip((_page - 1) * _size) // 跳过多少条
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
```

### 获取单个文章

```js
// 获取单个文章
app.get("/articles/:id", async (req, res) => {
  try {
    let { id } = req.params;

    await client.connect();
    const collection = client.db("test").collection("articles");
    const ret = await collection.findOne({ _id: ObjectID(id) });

    res.status(200).json({
      article: ret,
    });
  } catch (err) {
    next(err);
  }
});
```

### 更新文章

```js
// 更新文章
app.patch("/articles/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { article } = req.body;

    await client.connect();
    const collection = client.db("test").collection("articles");

    article.updateAt = new Date();
    await collection.updateOne(
      { _id: ObjectID(id) },
      {
        $set: article,
      }
    );

    const ret = await collection.findOne({ _id: ObjectID(id) });

    res.status(201).json({
      article: ret,
    });
  } catch (err) {
    next(err);
  }
});
```

### 删除文章

```js
// 删除文章
app.delete("/articles/:id", async (req, res) => {
  try {
    let { id } = req.params;

    await client.connect();
    const collection = client.db("test").collection("articles");
    await collection.deleteOne({ _id: ObjectID(id) });

    res.status(204).json({
      article: {},
    });
  } catch (err) {
    next(err);
  }
});
```

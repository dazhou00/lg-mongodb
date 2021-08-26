# 基础概念

- MongoDB 是文档型数据库，存储的数据类似于 JSON 格式数据
- MongoDB 数据库可以理解为一个对象
- 对象中存储着不同的集合
- 集合中存储着不同的文档

```javascript
{
  // 数据库 Database
  "京东": {
    // 集合 Collection，对应关系型数据库中的 Table
    "用户": [
      // 文档 Document，对应关系型数据库中的 Row
      {
        // 数据字段 Field，对应关系数据库中的 Column
        "id": 1,
        "username": "张三",
        "password": "123"
      },
      {
        "id": 2,
        "username": "李四",
        "password": "456"
      }
      // ...
    ],
    "商品": [
      {
        "id": 1,
        "name": "iPhone Pro Max",
        "price": 100
      },
      {
        "id": 2,
        "name": "iPad Pro",
        "price": 80
      }
    ],
    "订单": []
    // ...
  },

  // 数据库
  "淘宝": {}

  // ...
}
```

## 数据库

在 MongoDB 中，数据库包含着一个或多个文档集合

### 查看数据库列表

```powershell
show dbs
```

### 查看当前数据库

```powershell
db
```

- MongoDB 默认数据库为 test, 如果没有创建新的的数据库，集合将被存放大 test 数据库中

- 保留数据库名，可以直接访问这些有特殊作用的数据库
  - **admin**："root" 数据库， 将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限；一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器
  - **local**：永远不会被复制，可以用来存储限于本地单台服务器的任意集合
  - **config**: 当 Mongo 用于分片设置时，config 数据库在内部使用，用于保存分片的相关信息

### 创建/切换数据库

```powershell
use <DATABASE_NAME>

# 在 MongoDB 中数据库只有真正的有了数据才会被创建出来
```

- 可以切换到不存在的数据库
- 首次将数据存储在数据库中（例如通过创建集合）时，MongoDB 会创建数据库

```powershell
# 在 insertOne() 操作期间创建数据库 myNewDatabase 和集合 myCollection

use myNewDatabase
db.myCollection.insertOne( { x: 1 } );
```

#### 数据库命名规则

- 不区分大小写，建议全部小写
- 不能包含空字符
- 数据库名称不能为空，且少于 64 个字符
- Windows 上不能有 `/\. "$*<>:|?` 这些特殊字符
- Unix 和 Linux 上不能有 `/\. "$` 这些特殊字符


### 输出数据库

1. 使用 use 命令切换到要删除的数据库
2. 使用 `db.dropDatabase()` 删除当前数据库

## 集合

集合类似于关系型数据的表，MongoDB 将文档存储在集合中

### 创建集合

- 如果不存集合，第一次为该集合存储数据时，会自动创建该集合

```powershell
db.newCollection.insert({X: 1})
```

- MongoDB 提供 `db.createCollection() 方法来 显式 创建具有各种选项的集合
- 设置最大大小或文档验证规则
- 如果为指定这些选项，则不会显示创建集合
- 在首次存储集合数据时，会创建新的集合

#### 集合名称规则

- 以下划线或字母开头
- 不能包含 `$`
- 不能为空字符串
- 不能包含空字符
- 不能以 `.` 开头
- 长度限制
  - v4.2 最大 120 个字节
  - v4.4 最大 255 个字节

### 查看集合

```powershell

show collections

```

### 删除集合

```powershell
db.集合名称.drop()
```

## 文档

- MongoDB 将数据记录存储为 BSON 文档
- BOSN(Binary JSON) 是 JSON 文档的 二进制表示形式，比 JSON 包含更多的数据类型
- [BSON 规范](https://bsonspec.org/)
- [支持的数据类型](https://docs.mongodb.com/manual/reference/bson-types/)

### 文档结构

- 文档有字段和值对组成

```javascript
{
   field1: value1,
   field2: value2,
   field3: value3,
   ...
   fieldN: valueN
}
```

### 字段名称

- 字段名称 `_id` 保留用作主键，它的值在集合中必须唯一确定，不可变，并且是数组以外的任何类型
- 不能包含空字符
- 顶级字段名称不能以 `$` 开头
  - v3.6 开始，服务器运行存储包含 `.` 和 `$` 的字段名称

### 数据类型

- 字段的值可以是任何 BSON 数据类型，包括其他文档，数组和文档数组

```jsvascript
var mydoc = {
    _id: ObjectId("5099803df3f4948bd2f98391"),
    name: { first: "Alan", last: "Turing" },
    birth: new Date('Jun 23, 1912'),
    death: new Date('Jun 07, 1954'),
    contribs: [ "Turing machine", "Turing test", "Turingery" ],
    views : NumberLong(1250000)
}
```

#### 常用数据类型

| 类型               | 整数标识符 | 别名(字符串标识符) | 描述                                                    |
| :----------------- | :--------- | :----------------- | :------------------------------------------------------ |
| Double             | 1          | "double"           | 双精度浮点值。用于存储浮点值                            |
| String             | 2          | "string            | 字符串类型，在 MongoDB 中，UTF-8 编码的字符串才是合法的 |
| Object             | 3          | "onject"           | 用于嵌入文档                                            |
| Array              | 4          | "array"            | 用于将数据 或列表 或多个值存储为一个键                  |
| Binary data        | 5          | "binData"          | 二进制数据                                              |
| ObjectId           | 7          | "objectId"         | 对象 ID，用于创建文档的 ID                              |
| Boolean            | 8          | "bool              | 布尔值                                                  |
| Date               | 9          | "date"             | 日期时间，用 UNIX 时间格式来存储当前时间                |
| Null               | 10         | "null"             | 用于创建空值                                            |
| Regular Expression | 11         | "rehex”            | 正则表达式类型                                          |
| 32-bit integer     | 16         | "int"              | 整型数值，用于存储 32 位整型数值                        |
| Timestamp          | 17         | "timpestamp"       | 时间戳，记录文档修改或添加的具体时间                    |
| 64-bin integer     | 18         | "long"             | 整型数值，用于存储 64 位整型数值                        |
| Decimal128         | 19         | "decimal"          | 数值类型，存储更精确的数字，例如货币                    |


### `_id`字段

- 在 MongoDB 中， 存储在集合中的每个文档都需要一个唯一的 `_id` 字段作为主键
- 如果插入文档省略 `_id` 字段，则 MongoDB 驱动程序会自动为 `_id` 字段生成 `ObjectId`
- 默认情况下， MongoDB 在创建 集合时会在 `_id` 字段上创建唯一索引
- `_id` 字段始终时文档中的第一个字段
- `_id` 字段可以包含任何 BSON 数据类型的值，但不能是数组

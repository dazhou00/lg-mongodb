# MongoDB 图形化管理软件

- Roto 3T
- Studio 3T
- Navicat
- MongoDB Compass
- ...

推荐使用 [Navicat](http://www.navicat.com.cn/)


# 基础操作(CRUD)

## 创建文档(Create)

创建或插入操作将新的文档添加到集合中，如果集合不存在，则插入操作将创建集合


| `db.collection.insertOne()` | 插入单个文档到集合中 |
| -- | -- |
| `db.collection.insertMany()` | 插入多个文档到集合中 |
| `db.collection.insert()` | 插入一个或多个文档到集合中 |


### 插入单个文档

```powershell

db.inventory.insertOne({
  item: 'canvas',qty:100,tags:['cotton'], size: {h:28, w: 35.5, uom: 'cm'}
})

```


### 插入多个文档

```powershell
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])
```


## 查询文档(READ)

### 基本查询

- `db.collection.find(query, projection)`
  - query: 可选，使用查询操作符指定查询条件
  - projection: 可选，使用投影操作符指定返回的键；查询时放回文档中所有键值，只需要省略该参数即可
- `db.collection.findOne()`

```powershell
db.user.find( # collection
  {age: {$gt: 18}}, # query criteria
  {name: 1, addres: 1} # projection
).limit(5) # cursor modifier

```
[示例文档](https://docs.mongodb.com/manual/tutorial/query-documents/)


#### 查询所有文档

```powershell
db.inventory.find({})
```
等价于 SQL 
```sql
SELECT * FROM inventory
```

```powershell
# 格式打印结果
db.inventory.find().pretty()
```

#### 指定返回的文档字段

```powershell
db.inventory.find({},{
  item: 1,
  qty: 1
})

```

#### 相等条件查询

```powershell
db.inventory.fing({status: 'D'})
```
等价于 SQL
```sql
SELECT　＊　FORM　inventory WHERE status = 'D' 
```

#### 指定 AND 条件

```powershell
# 检索状态为 'A' 且数量小于($lt) 30 的清单集合中的所有文档
db.inventory.find({ status: 'A', qty: {$lt: 30}})
```
等价于 SQL
```sql
SELECT * FROM inventory WHERE status = 'A' AND qty < 30
```

#### 指定 OR 条件

- 使用 `$or` 运输符，可以指定一个复合查询，将每个子句与一个逻辑或连接相连接，以便该查询选择集合中至少匹配一个条件的文档

```powershell
# 检索状态为 'A' 或 数量小于($lt) 30 的集合中的所有文档
db.inventory.find({
  $or:[
    {status: 'A'},
    {qty: {$lt: 30}}
  ]
})
```
等价于 SQL
```sql
SELECT * FROM inventory WHERE status = 'A' OR qty < 30
```

#### 指定 AND 和 OR 条件

```powershell
# 状态为 'A', 且 qty 小于($lt) 30 或  item 以字符 p 开头
db.inventory.find({
  status: 'A',
  $or: [{ qty: {$lt: 30}}, {item: /^p/}]
})
```
等价于 SQL
```sql
SELECT * FROM inventory WHERE status = 'A' AND ( qty < 30 OR item LIKE 'p%')
```

#### 使用查询运输符指定条件

```powershell
# 从 状态为 'A' 或 'D' 等于 '库存' 的清单中检索所有文档
db.inventory.find({status: {$in: ['A', 'D']}})
```
等价于 SQL
```sql
SELECT * FROM inventory WHERE status in ('A', 'D')
```

### 查询运算符

[查询运算符文档](https://docs.mongodb.com/manual/reference/operator/query/)

#### 比较运算符

| 名称 | 描述 |
| -- | -- |
| `$eq` | 等于 |
| `$gt` | 大于 |
| `$gte` | 大于或等于 |
| `$in` | 数组中指定的任何值 |
| `$lt` | 小于 |
| `$lte` | 小于等于 |
| `$ne` | 不等于指定值的值 |
| `$nin` | 不在数组中的任何值 |


#### 逻辑运算符

| 名称 | 描述 |
| -- | -- |
| `$and` | 将查询子句与逻辑连接，并返沪与这两个子句条件匹配的所有文档 |
| `$not` | 反转查询表达式的效果，并返回与查询表达式不匹配的文档 |
| `$nor` | 用逻辑 NOR 连接查询子句，返回所有不能匹配这两个子句的文档 |
| `$or` | 用逻辑连接查询子句，返回与任一子句条件匹配的所有文档 |


### 查询嵌套文档

#### 匹配嵌套文档

- 要在作为嵌入/嵌套文档的字段上指定相等条件，请使用查询过滤器文档 `{<field>: <value>}`，其中 `<value>` 是要匹配的文档。
- 整嵌入式文档上的相等匹配要求与指定的 `<value>` 文档完全匹配，包括字段的顺序

```powershell
# 等于文档 {h: 14, w: 21, uom: "cm"} 的所有文档
db.inventory.find({
  size: {h: 14, w: 21; uom: 'cm'}
})
```

#### 查询嵌套字段

- 要做嵌入式/嵌套文档中的字段上指定查询条件，要使用点符号 `"field.nestedField"`
- 使用点符号查询时，字段和嵌套字段必须在引号内


**指定相等匹配**
```powershell
# 选择嵌套在 size 字段中的 'uom' 字段 等于 'in' 的所有文档
db.inventory.find({
  "size.uom" : "in"
})
```

**使用查询运算符**

- 查询过滤文档 使用查询运算符形式 `{ <field1>: { <operator1>: <value1>}, ... }`

```powershell
# 查询在 size 字段中嵌入的 h 字段上使用 小于($lt) 运算符
db.inventory.find({
  "size.h" : {$lt: 15}
})
```

**指定 AND 条件**
```powershell
#  选择嵌套字段 h 小于 15，嵌套字段 uom 等于 'in' ，状态字段等于 'D' 的所有文档
db.inventory.find({
  "size.h": {$lt: 15},
  "size.uom": "in",
  status: "D"
})
```

### 查询数组

- 匹配一个数组
```powershell
# 字段标签值是按指定顺序恰好具有两个元素 "red" 和 "blank" 的数组
db.inventory.find({
  tags: ['red', 'blank']
})

# 找到一个同时包含元素 "red" 和 "blank" 的数组，而不考虑顺序或该数组中的其他元素
db.inventory.find({
  tags: { $all : ['red', 'blank']}
})
```

- 查询数组中的元素
```powershell
# tag 是一个包含字符串 "red" 作为其元素之一的数组
db.inventory.find({
  tags: 'red'
})
```

- 使用查询运算符
```powershell
# 查询数组 dim_cm 包含至少一个大于 25 的元素的所有文档
db.inventory.find({
  dim_cm: {$gt: 25}
})
```

- 为数组指定多个条件
```powershell
# 一个元素可以满足大于 15 的条件，而另一个元素可以满足小于 20 的条件；或者单个元素可以满足以下两个条件
db.inventory.find({dim_cm: { $gt: 15, $lt: 20}})

# 使用 $elemMatch 在数组每个元素上指定多个条件，使至少一个数组元素满足所有指定条件
# 查询在 dim_cm 数组中包含至少一个同时大于 22 和 小于 30 的元素的所有文档
db.inventory.find({
  dic_cm: { $elemMatch: {$gt: 22, $lt: 30}}
})

# 使用点符号，可以为数组的特定索引或位置指定元素的查询条件
# 字段和嵌套字段必须在引号内
# 查询数组 dim_cm 中第二个元素大于 25 的所有文档
db.inventory.find({
  "dim_cm.1": {$gt: 25}
})

# 使用 $size 运算符可按元素数量查询数组
# 选择数组标签具有3个元素的文档
db.inventory.find({
  tags: {$size: 3}
})
```

### 查询嵌入文档的数组

- 精确匹配
```powershell
# 库存数组中的元素与指定文档匹配的所有文档
db.inventory.find({
  instock: { warehouse: 'A', qty: 5}
})
```

- 在嵌入文档数组中的字段上指定查询条件
```powershell
# 选择所有库存数组中包含至少一个嵌入式文档的嵌入式文档，这些嵌入式文档包含值小于或等于20的字段qty
db.inventory.find({
  'instock.qty':{ $lte: 20}
})
```

- 使用数组索引在嵌入式文档中查询字段
```powershell
# 选择所有库存文件，其中库存数组的第一个元素是包含值小于或等于20的字段qty的文档
db.inventory.find({ 'instock.0.qty': { $lte: 20}})
```

- 为文档数组指定多个条件
```powershell
# 单个嵌套文档在嵌套字段上满足多个查询条件
# 询库存数组中至少有一个嵌入式文档的文档，这些文档同时包含等于5的字段qty和等于A的字段仓库
db.inventory.find({
  instock: { $elemMatch: {qty: 5, warehouse: 'A'}}
})

# 查询库存数组中至少有一个嵌入式文档的嵌入式文档包含的字段qty大于10且小于或等于20
db.inventory.find({
  instock: { $elemMatch: { qty: { $gt: 10, $lte: 20}}}
})

# 查询匹配文档，其中嵌套在库存数组中的任何文档的qty字段都大于10，而数组中的任何文档（但不一定是同一嵌入式文档）的qty字段小于或等于20
db.inventory.find({
  "instock.qty": {$gt: 10, $lte: 20}
})

# 查询库存数组中具有至少一个包含数量等于5的嵌入式文档和至少一个包含等于A的字段仓库的嵌入式文档（但不一定是同一嵌入式文档）的文档
db.inventory.find({
  "instock.qty" : 5,
  "instock.warehouse": 'A'
})
```

### 指定查询返回的项目字段

- 返回匹配文档中的所有字段
```powershell
# 返回状态为 'A' 的清单集合中所有文档的所有字段
db.inventory.find({
  status: 'A'
})
```

- 仅返回指定字段和 `_id` 字段
```powershell
# 将投影文档中的 <field> 设置为 1，投影可以显式包含多个字段
# 匹配的文档中仅返回项目，状态和默认情况下的 _id 字段
db.inventory.find({
  status: 'A',
  {
    item: 1,
    status: 1
  }
})
```

- 禁止 `_id` 字段
```powershell
# 通过将投影中的 _id 字段设置 为 0 来从结果中删除 _id 字段
db.inventory.find(
  { status: 'A'},
  {
    item: 1,
    status: 1,
    _id: 0
  }
)
```

- 返回所有但排除的字段
```powershell
# 返回匹配文档中状态和库存字段以外的所有字段
db.inventory.find(
  {status: 'A'},
  {
    status: 0,
    instock: 0
  }
)
```

- 返回嵌入式文档中的特定字段
```powershell
db.invnetory.find(
  {status: 'A'},
  {
    item: 1,
    status: 1,
    "size.uom": 1
  }
)

# v4.4+
db.invnetory.find(
  {status: 'A'},
  {
    item: 1,
    status: 1,
    size:{
      uom:1
    }
  }
)
```

- 禁止嵌入文档的特定字段
```powershell
db.inventory.find(
  {status: 'A'},
  {"size.uom": 0}
)

#v4.4+
db.inventory.find(
  {status: 'A'},
  {size: {uom: 0}}
)
```

- 在数组中的嵌入式文档上投射
```powershell
db.inventory.find(
  {status: 'A'},
  {
    item: 1,
    status: 1,
    "instock.qty": 1
  }
)
```

- 返回数组中的项目特定数组元素
  - 用于操纵数组的投影运算符： `$elemMatch`，`$slice` 和`$`
```powershell
# 使用 $slice 投影运算符返回库存数组中的最后一个元素
db.inventory.find(
  {status: 'A'},
  {
    item: 1,
    status: 1,
    instock: {$slice: -1}
  }
)
```


### 查找空缺字段或缺少字段

- 相等过滤器
```powershell
# 查询将匹配包含其值为 null 的 item 字段或不包含 item 字段的文档
db.inventory.find({iten: null})
```

- 类型检查
```powershell
#  查询仅匹配包含 item 字段，其值为 null 的文档；即 item 字段的值为 BSON 类型为 Null（类型编号10）
db.inventory.find({item: {$type: 10}})
```

- 存在检查
```powershell
# 查询不包含字段的文档
db.inventory.find({item: { $exists: false}})
```


## 更新文档(Update)

```powershell
# 更新第一个匹配的文档
db.collection.updateOne(<filter>, <update>, <options>) 

# 更新所有匹配的文档
db.collection.updateMany(<filter>, <update>, <options>)

# 替换第一个匹配的文档
db.collection.replaceOne(<filter>, <update>, <options>)

```

- 可以指定标识要更新的文档的条件或过滤器。这些过滤器使用与读取操作相同的语法
```powershell
db.user.updateMany( # collection
  { # update filter
    age: {$lt: 18}
  },
  { # update action
    $set; {status: 'reyect'}
  }
)
```

> 如果更新或替换字段不存在，`$set`  运算符将创建改字段


- 更新单个文档
```powershell
# 更新项目等于 paper 的第一个文档
db.inventory.updateOne(
  {item: 'paper'},
  {
    $set: {'size.uom': 'cm', status: 'P'},
    $currentDate: {lastModified: true}
  }
)

# 使用 $set 运算符 将 size.uom 字段更新为 cm, 将 status 字段更新为 P
# 使用 $currentDate 运算符 将 lastModified 字段的值更新为当前日期，如果 lastModified 字段不存在，则创建改字段
```

- 更新多个文档
```powershel
# 更新所有 qty 字段小于 50 的文档
db.inventory.updateMany(
  {qty: { $lt: 50}},
  {
    $set: {"size.uom": "in", status: "P"},
    $currentDate: {lastModified: true}
  }
)
```

- 替换文档
  - 替换文档时，替换文档必须仅由字段/值对组成；即不包含更新运算符表达式
  - 替换文档可以具有与原始文档不同的字段
  - 由于 _id 字段是不可变的，因此可以省略 _id 字段；但是，如果您确实包含 _id 字段，则它必须与当前值具有相同的值
```powershell
# 替换了清单集合中项目 "paper" 的第一个文档
db.inventory.replaceOne(
   { item: "paper" },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)
```


## 删除文档(Delete)

```powershell
# 删除所有匹配的文档
db.collection.deleteMany(<filter>)

# 删除匹配的第一个文档
db.collection.deleteOne(<filter>)
```

- 指定标准或过滤器，以标识要删除的文档。这些过滤器使用与读取操作相同的语法
```powershell
db.userdeleteMany( # collection
  {status: 'reject'} # delete filter
)
```

- 删除所有文档
```powershell
db.inventory.deleteMany({})
```

- 删除所有符号条件的文档
```powershell
# 从状态字段等于“ A”的清单集合中删除所有文档
db.inventory.deleteMany({status: 'A'})
```

- 仅删除一个符号条件的文档
```powershell
# 删除状态为“ D”的第一个文档
db.inventory.deletOne({ status: 'D'})
```
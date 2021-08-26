# MongoDB

## 简介

- 官网： https://www.mongodb.com/
- MongoDB 由 C++ 编写，基于分布式文件存储的开源数据库
- MongoDB 介于关系型和非关系之间，是非关系数据库中功能最丰富的，最像关系型的
- MongoDB 将数据存储为一个文档，数据结构由键值(key = value)对组成；类似于 JSON 对象。字段值可以包含其他文档、数组及文档数组

```js
{
  name: 'sue',
  age: 20,
  status: 'A',
  groups: ['news', 'sports']
}
```

- MongoDB 查询功能非常强大
- 支持大部分关系型数据库中的单表查询，还支持范围查询、排序、聚会、MapReduce 等
- MongoDB 的查询语法类似于面向对象的程序语言

## 安装 MongoDB

1. 下载 MongoDB zip 压缩包
   https://www.mongodb.com/try/download/community

2. 解压压缩包，将解压出来的资源文件放到一个文档的目录中

3. 关于 MongoDB 软件包目录文件

|   文件名   |               说明               |
| :--------: | :------------------------------: |
| mongod.exe |    服务端，用来启动数据库服务    |
| mongo.exe  | 客户端, 用来连接数据库操作数据库 |

4. 将 MongoDB 安装包中的 bin 目录配置到系统环境变量 path 中，可以在命令行任何位置访问到 bin 目录中的可执行程序

```powershell
mongod --version
```

> 如果执行出错。 可以双击运行 bin 目录下的 vcredist_x64.exe 安装程序

## 启动和停止 MongoDB 数据库服务

```powershell
mongod --dbpath="数据存储目录"
```

> mongod 默认监听 127.0.0.1:27017

如果单独执行 mongod，它会默认使用执行 mongod 命令所处磁盘根目录/data/db 作为数据存储目录。

## Mongo Shell

- MongoDB 官方提供的一个在命令行中用来操作 MongoDB 服务的客户端工具
- 使用 mongo Shell 可以对 MongoDB 数据库进行数据的管理

### 启动 Mongo Shell 连接到 MongoDB

#### 连接默认端口上的本地 MongoDB 服务

- 使用默认端口 `27017` 连接到本地主机运行的 MongoDB 实例

```powershell
mongo
```

#### 连接指定端口上的本地 MongoDB 服务

- 使用 `--port` 选项 指定端口

```powershell

mongo --port 2021

```

#### 连接远程主机上的 MongoDB 服务

连接远程主机上的 MongoDB 服务需要明确指定主机名和端口号

- 指定一个连接字符串

```powershell
mongo "mongodb://mongodb0.example.com:28015"
```

- 使用命令行选项 `--host <主机>:<端口>`

```powershell
mongo --host mongodb0.example.com:28015
```

- 使用`--host <host>`和`--port <port>`命令行选项

```powershell
mongo --host mongodb0.example.com --port 28015
```

#### 连接具有身份认证的 MongoDB 服务

- 在连接字符串中指定用户名，身份验证数据库以及可选的密码

```powershell
mongo "mongodb://alice@mongodb0.examples.com:28015/?authSource=admin"
```

- 使用`--username <user>`和`--password`，`--authenticationDatabase <db>`命令行选项

```powershell
mongo --username alice --password --authenticationDatabase admin --host mongodb0.examples.com --port 28015
```

> 注意：如果您指定--password 而不输入用户密码，则外壳程序将提示您输入密码。

### 执行环境

- 提供了 JavaScript 执行环境
- 内置了一些数据库操作命令
  - show dbs
  - db
  - use database
  - show collections
  - ...
- 提供了一大堆的内置 API 用来操作数据库
  - db.users.insert({ name: 'Jack', age: 18 })

### 退出连接

- exit
- quit()
- Ctrl + c

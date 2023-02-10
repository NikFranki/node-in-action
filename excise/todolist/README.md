# TODOLIST

根据所学，验证学习成果

此项目采用前后端分离的形式，不再使用模板语言渲染 HTML 或者使用服务端渲染 HTML 的方式进行

## phase1 功能点

- 查看 TODO 列表
- 添加 TODO
- 删除 TODO
- 修改 TODO
- 筛选 TODO

## 项目结构

本项目服务端使用 express，客户端使用 react

todolist
  client
  server

### 前端

### 中间件

### 服务端数据库设计

todolist表

字段包括

### 跨域

前端需要注意的点

前端的请求必须带上跨域相关字段，如果使用的是 `fetch` 方法，那么需要在第二个参数带上 `credentials` 字段

如：

```js
fetch(
      'http://localhost:8000/user/login',
      {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 跨域请求时，携带 cookie，非常重要！！！
        body: JSON.stringify(form),
      }
    )
```

** fetch 默认对服务端通过 Set-Cookie 头设置的 cookie 也会忽略，若想选择接受来自服务端的 cookie 信息，也必须要配置 credentials 选项

如果是使用 `axios`，那么需要带上 `withCredentials` 字段

如:

```js
const service = axios.create({  
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // 跨域请求时，携带 cookie，非常重要！！！
  timeout: 60000,
  headers: {"Content-Type": "application/json; charset=UTF-8;"}
});
```

后端需要注意的点

使用 cors 中间件，开启接受跨域请求

如：

```js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

** response 头信息Access-Control-Allow-Origin，且必须指定域名，而不能指定为*。

## 部署

<!-- DEBUG=todolist:* npm start -->
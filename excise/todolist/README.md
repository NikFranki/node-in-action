# TODOLIST

根据所学，验证学习成果

项目采用前后端分离的形式，不再使用模板语言渲染 HTML 或者使用服务端渲染 HTML 的方式进行

## 功能点

- [x] 注册
- [x] 登录
- [x] 查看 TODO 列表
- [x] 添加 TODO
- [x] 删除 TODO
- [ ] 修改 TODO
- [x] 筛选 TODO

## 项目架构

服务端

使用 `express + mysql + cors` 开发

文件目录组件结构

```bash
.
├── app.js
├── bin
│   └── www
├── db.json
├── lib
│   ├── entry.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── notfound.js
│   └── user.js
├── package-lock.json
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── entries.js
│   └── user.js
├── services
│   └── db.js
└── views
    ├── 404.jade
    ├── 5xx.jade
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

前端

使用 `react + antd` 开发

文件目录组件结构

```bash
.
├── README.md
├── build
│   ├── asset-manifest.json
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── robots.txt
│   └── static
│       ├── css
│       └── js
├── package-lock.json
├── package.json
├── public
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── components
    │   ├── menu.css
    │   └── menu.js
    ├── error-page.js
    ├── home
    │   └── todolist.js
    ├── index.css
    ├── index.js
    ├── login
    │   ├── index.css
    │   └── index.js
    ├── logo.svg
    ├── register
    │   ├── index.css
    │   └── index.js
    ├── reportWebVitals.js
    └── setupTests.js
```

### 注册

效果展示

![注册](http://qiniu.sevenyuan.cn/register.jpg)

服务端 user 表设计

```sql
/* 创建数据库表(user) */
conn.query(
  'CREATE TABLE IF NOT EXISTS user (' +
  'username VARCHAR(60) NOT NULL, ' +
  'password VARCHAR(100) NOT NULL, ' +
  'avatar VARCHAR(512))',
);
```

路由注册

```js
const { User, upload } = require('../lib/user');
const user = new User({});

/* user register */
router.post('/register', upload.single("avatar"), user.register);
```

这里把用户的相关操作都用 User 类封装了起来，位置在 `node-in-action/excise/todolist/server/lib/user`

上传头像处理

后端文件处理中间件，如果指定了表单图片文件的字段名称，前端的 `input file` 控件的 `name` 属性必须与之相同，即：

后端代码细节（位置：`node-in-action/excise/todolist/server/routes/user.js`）

```js
// 后端使用 multi 中间件来处理图片文件上传，avatar 就是指定的图片文件字段名称
upload.single("avatar")
```

前端代码细节（位置：`node-in-action/excise/todolist/client/src/register/index.js`）

```js
<Upload
  name="avatar" // 需要特别指定，跟后端定义的字段名称相同
  listType="picture-card"
  maxCount={1}
  accept=".jpg, .png"
  beforeUpload={(file) => {
    if (file) {
      setAvater(file);
    }
    return false;
  }}
>
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
</Upload>
```

跨域 & session 处理

在新的 chrome 浏览器要求中，如果想要后端返回的 cookie 能够给浏览器接受并设置，就需要前后端协同好传递字段，告知浏览器可以安全去设置 cookie，具体实现如下：

后端跨域代码细节

安装 `cors` 中间件

```bash
npm i cors
```

中间件挂载

必须设置 `credentials` 字段，明确告诉浏览器这是验证过可以信任的资源

```bash
app.use(cors({
  origin: 'http://localhost:3000', // 需要指定信任的源 （response 头信息Access-Control-Allow-Origin，且必须指定域名，而不能指定为）
  credentials: true, // 告知浏览器，是可以信任的，后续会在请求的 header 中带上 Access-Control-Allow-Credentials: true 
}));
```

前端跨域代码细节

前端的请求必须带上跨域相关字段，如果使用的是 `fetch` 方法，那么需要在第二个参数带上 `credentials` 字段，否则会影响 session 的使用（如果不携带会出现即使登录接口已经设置了 session，调用其他的接口仍然获取不到的情况）

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

fetch 默认对服务端通过 Set-Cookie 头设置的 cookie 也会忽略，若想选择接受来自服务端的 cookie 信息，也必须要配置 credentials 选项

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

### 登录

效果如下：

![登录](http://qiniu.sevenyuan.cn/login.jpg)

登录态处理

后端安装 `express-session` 中间件

```bash
npm i express-session
```

后端 session 代码细节（位置：`node-in-action/excise/todolist/server/lib/user.js`）

```js
login(req, res, next) {
  // ...
  const data = {
    username: result[0].username,
    avatar: result[0].avatar,
  };
  // 记录用户登录态
  req.session.userInfo = data;
  res.send(JSON.stringify({
    code: 200,
    message: `${username} is logged in!`,
    data,
  }));
  // ...
}
```

前端在每个请求中，带上 `credentials` 字段即可

### 查看 TODO 列表

效果如下：

![列表](http://qiniu.sevenyuan.cn/list.jpg)

服务端 todolist 表设计

```sql
/* 创建数据库表(todolist) */
conn.query(
  'CREATE TABLE IF NOT EXISTS todolist (' +
  'id VARCHAR(40) NOT NULL, ' +
  'content VARCHAR(512) NOT NULL, ' +
  'status INT(10) NOT NULL, ' +
  'date Date, ' +
  'PRIMARY KEY(id))',
);
```

后端代码细节（位置：`node-in-action/excise/todolist/server/lib/entry.js`）

```js
async getList (req, res, next) {
  // ...
}
```

前端代码细节（位置：`node-in-action/excise/todolist/client/src/home/todolist.js`）

```js
const Todolist = () => {
  // ...
};
```

### 添加 TODO

后端代码细节（位置：`node-in-action/excise/todolist/server/lib/entry.js`）

```js
async addTodo (req, res, next) {
  // ...
}
```

前端代码细节（位置：`node-in-action/excise/todolist/client/src/home/todolist.js`）

```js
const Todolist = () => {
  // ...
  const handleAdd = () => {
    // ...
  };
};
```

### 删除 TODO

后端代码细节（位置：`node-in-action/excise/todolist/server/lib/entry.js`）

```js
async deleteTodo (req, res, next) {
  // ...
}
```

前端代码细节（位置：`node-in-action/excise/todolist/client/src/home/todolist.js`）

```js
const Todolist = () => {
  // ...
  const handleDelete = () => {
    // ...
  };
};
```

### 修改 TODO

目前只完成状态的更新，内容的更新还没实现

后端代码细节（位置：`node-in-action/excise/todolist/server/lib/entry.js`）

```js
async updateTodo (req, res, next) {
  // ...
}
```

前端代码细节（位置：`node-in-action/excise/todolist/client/src/home/todolist.js`）

```js
const Todolist = () => {
  // ...
  const handleUpdate = () => {
    // ...
  };
};
```

### 筛选 TODO

后端代码细节（位置：`node-in-action/excise/todolist/server/lib/entry.js`）

```js
async getList (req, res, next) {
  // ...
  const sqlTotal = 'SELECT * FROM todolist';
  const statusQuery = isGtFILTER_ALL ? ' WHERE status=?' : '';
  const contentQuery = content ? ` ${statusQuery ? 'AND' : 'WHERE'} content LIKE '${content}%'` : '';
  // ...
}
```

前端代码细节（位置：`node-in-action/excise/todolist/client/src/home/todolist.js`）

```js
const Todolist = () => {
  // ...
  const handleFilter = () => {
    // ...
  };
};
```

## 部署

暂无

<!-- DEBUG=todolist:* npm start -->
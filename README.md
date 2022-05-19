# rules-lib-vue

> 基于开源项目vue-admin-template搭建。https://github.com/PanJiaChen/vue-admin-template/tree/master

## 项目结构

```text
├── src
│   ├── api                 后端接口
│   ├── assets              静态资源
│   ├── components          公共组件
│   ├── icons               图标
│   ├── layout              布局
│   ├── router              路由
│   ├── store               全局存储
│   ├── styles              样式
│   ├── utils               工具
│   └── views               页面
│       ├── dashboard           首页仪表盘
│       ├── database            知识库
│       ├── login               登录页
│       ├── rule                规则
│       ├── rulesengine         规则引擎
│       └── segment             片段
```

## Extra

如果你想要根据用户角色来动态生成侧边栏和 router，你可以使用该分支[permission-control](https://github.com/PanJiaChen/vue-admin-template/tree/permission-control)

## Build Setup

```bash
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

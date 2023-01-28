> 基于磐石中台开发项目模板

## 运行
1.yarn install
1.yarn run start-test01

## 打包
1. yarn build

## 目录结构描述
```bash
├── config                           umi相关配置
│   └── .umirc.chainWebpack.ts       webpack配置
│   └── .umirc.onDevCompileDone.ts   本地运行之后的钩子
│   └── .umirc.react.ts              antd插件的配置
│   └── .umirc.theme.ts              antd主题的配置
│   └── .umirc.routes.ts             路由配置
├── mock                             模拟服务端接口
├── node_modules                     项目相关依赖
├── src                              主程序
│   └── authorized                   权限相关业务
│   └── hooks                        react 自定义全局hooks
│   └── pages                        相关路由会根据pages下的目录文件生成
│   	└── company 		                           
│   	   └── depart 		                          
│   	   └── setting 		             
├── services                         服务端接口
│   	└── service.ts 		             nginx的服务前缀
│   	└── company.ts 		             相关模块接口
├── utils                            一些全局方法（先查看react-utils有没有）
├── app.ts                           运行时配置  作用及说明https://umijs.org/zh/guide/runtime-config.html
├── .umirc.ts                        umi相关配置
├── package.json                     node相关配置
```


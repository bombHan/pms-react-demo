import React from 'react';
import { Result, } from 'antd';
export default () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，你没有此页面的访问权限"
      extra={<a href="/home/#/msgcenter">返回消息中心</a>}
    />
  )
}

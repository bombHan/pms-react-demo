import React from 'react';
import { Result, } from 'antd';
export default () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="抱歉，服务器发生了错误。"
      extra={<a href="/home/#/msgcenter">返回消息中心</a>}
    />
  )
}

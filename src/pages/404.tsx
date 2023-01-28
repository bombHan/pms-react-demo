import React, { useEffect } from 'react';
import { Result, } from 'antd';
import { rejectError } from '@pms/pmcommon/src/tool/menuFunction.js'
import { message } from 'antd'
export default () => {
	useEffect(() => {
		rejectError(() => { }, '抱歉，你访问的页面不存在...', message)
	}, [])

	return (
		<Result
			status="404"
			title="404"
			subTitle="抱歉，你访问的页面不存在..."
			extra={<a href="/home/#/msgcenter">返回消息中心</a>}
		/>
	)
}

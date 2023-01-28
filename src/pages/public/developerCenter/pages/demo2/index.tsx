import React, { useMemo } from 'react';
import { Qrcode } from './qrcode';
import { Radio } from 'antd'

export default () => {

	const qrcode = useMemo(() => {
		return new Qrcode({
			softName: 'han的demo',
			client: 2,
			// light: true,
			size: 280,
			host: 'https://zhuang.pinming.cn',
			elementId: 'element',
			onCallback: res => {
				console.log(res);
			},
			onError: res => {
				console.log(res);
			},
		});
	}, []);

	return (
		<div>
			<Radio.Group
				optionType="button"
				defaultValue={2}
				style={{ marginBottom: 20 }}
				options={[
					{ label: '桩桩扫码', value: 1 },
					{ label: '微信扫码', value: 2 },
				]}
				onChange={e => {
					qrcode.onInit(e.target.value);
				}}
			/>
			<div id={'element'} />
				<a target='_blank' href='https://github.com/bombHan/pms-react-demo/blob/main/src/pages/public/developerCenter/pages/demo2/qrcode.ts'>源码链接</a>
		</div>
	);
};

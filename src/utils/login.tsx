import React from 'react';
import { Alert, Modal, Input } from 'antd';
export default () => {
	window.open('https://gboss-test02.pinming.org/proxy/auth')
	window.open('https://gboss-test02.pinming.org/proxy/url')
	Modal.confirm({
		title: '开发环境需要登录',
		okText: '登录',
		width: 670,
		onOk: () => {
			const Token = document.getElementById('Token') as HTMLInputElement;
			const Proxy = document.getElementById('Proxy') as HTMLInputElement;
			localStorage.setItem('site3-f-ue', Token.value);
			localStorage.setItem('gboss-proxyUrl', Proxy.value);
			window.location.reload()
		},
		content: (
			<div>
				<Alert
					message={
						<>
							<div>由于gboss环境，比较复杂，登录状态不好获取，需要手动登录，步骤：</div>
							<div>1. 登录测试环境gboss</div>
							<div>2. 新开窗口 输入https://gboss-test02.pinming.org/proxy/auth 获取Token,在下方输入</div>
							<div>3. 新开窗口 输入https://gboss-test02.pinming.org/proxy/url 获取Proxy,在下方输入</div>
							<div>TIP. 如果是和服务端联调，Proxy输入服务端的ip</div>
							<div>TIP. gboss的Token和桩桩Token用的相同的字段，如果出现登录问题，先清除sessionStorage里面的site3-f-ue</div>
							<div>4. 功能权限使用方式:</div>
							<div>
								<div>1. import {`{useGBossFunCode}`} from '@pms/react-auth'</div>
								<div>2. const auth = useGBossFunCode('/softManage');</div>
								<div>TIP. 由于服务端原因，本地开发权限获取不到，线上没有问题，等后续服务端解决</div>
							</div>
						</>
					}
					type="info" />
				<div>
					<span>Token:</span>
					<Input id="Token" />
				</div>
				<div>
					<span>Proxy:</span>
					<Input id="Proxy" />
				</div>
			</div>
		),
	});
};

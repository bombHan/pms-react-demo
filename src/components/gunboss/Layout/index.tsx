import React, { useEffect } from 'react'
import Header from '../Header/index'
import Content from '../Content/index'
import { renderHeader, renderRootStyle } from '@/utils/routesUtils'
import { useSetReactive } from '@pms/middleground-share'
import { findToken, findProxyUrl } from '@/services/api';
import { gbossLogin } from '@pms/gboss';
import "./index.less"

const Index = (props: any) => {
	const [state, setState] = useSetReactive({
		isLogin: false
	})
	const init = async () => {
		const { NODE_ENV } = process.env;
		if (NODE_ENV === 'development') {
			/** gboss的Token和桩桩Token用的相同的字段，如果出现登录问题，先清除sessionStorage里面的site3-f-ue */
			const token = localStorage.getItem('site3-f-ue');
			if (token) {
				state.isLogin = true
			} else {
				state.isLogin = false
				gbossLogin()
			}
		} else {
			const token = await findToken<any>();
			const proxyUrl = await findProxyUrl<any>();
			localStorage.setItem('site3-f-ue', token.data);
			localStorage.setItem('gboss-proxyUrl', proxyUrl.data);
			state.isLogin = true
		}
	}
	useEffect(() => {
		init()
	}, [])

	return (
		<>
			{
				state.isLogin && (
					<div className={renderRootStyle() ? 'gboss-root gboss-root-default' : 'gboss-root'}>
						{
							renderHeader() && <Header />
						}
						<Content {...props} />
					</div>
				)
			}
		</>
	)
}

export default Index
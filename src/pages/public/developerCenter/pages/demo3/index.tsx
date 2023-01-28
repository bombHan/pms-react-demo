import React from 'react';
import Drag from './Drag/index';

export default () => {
	function onSuccess() { }
	return (
		<div>
			<a target='_blank' href='https://github.com/bombHan/pms-react-demo/blob/main/src/pages/public/developerCenter/pages/demo3/Drag/index.tsx'>源码链接</a>

			<Drag
				leftDom={
					<div style={{ background: 'red', height: '500px' }}>
						左边
					</div>
				}
				rightDom={
					<div style={{ background: 'rgba(0,0,0,0.15)', height: '100%' }}>
						右边
					</div>
				}
			/>
		</div>
	);
};

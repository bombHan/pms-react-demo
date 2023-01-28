import React from 'react';
import Drag from './Drag/index';

export default () => {
	function onSuccess() { }
	return (
		<div>
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

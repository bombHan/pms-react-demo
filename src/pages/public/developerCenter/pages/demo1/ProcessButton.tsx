import React, { useMemo, useRef } from 'react';
import { Button } from 'antd';

interface IProps {
	/** 进度 */
	process?: number;
	/** 进度按钮中的文字 */
	text?: string;
}

export const ProcessButton = (props: IProps) => {
	const button = useRef<any>();
	const process = useMemo<number>(() => {
		return props.process || 0;
	}, [props.process]);
	const text = useMemo(() => {
		let obj: any = {
			front: '',
			back: '',
		};
		const textArr = (props.text || '').split('');
		const AllLength = textArr.length + 2;
		const currentLength = Math.floor(((props.process || 0) * AllLength) / 100);
		const frontTextArr = textArr.splice(0, currentLength - 1);
		obj.front = frontTextArr.join('');
		obj.back = textArr.join('');
		// console.log(textArr, 'AllLength', AllLength, 'currentLength', currentLength, 'props.process', props.process, 'obj', obj)
		return obj;
	}, [props.process]);
	return (
		<div
			style={{
				position: 'relative',
				overflow: 'hidden',
				display: 'inline-block',
			}}
		>
			<Button>
				<span style={{ visibility: 'hidden' }}>{props.text}</span>
			</Button>
			<span
				style={{
					position: 'absolute',
					zIndex: 99,
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					wordBreak: 'keep-all',
				}}
			>
				<a>{props.text}</a>
			</span>
			<div
				style={{
					position: 'absolute',
					zIndex: 99,
					left: 0,
					top: 0,
					wordBreak: 'keep-all',
					width: `${process}%`,
					overflow: 'hidden',
				}}
			>
				<Button ref={button} type="primary">
					<span>{props.text}</span>
				</Button>
			</div>
		</div>
	);
};

ProcessButton.defaultProps = {
	process: 0,
	text: '导入中',
};

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import './index.less'

interface IDrag {
	leftDom: React.ReactNode;
	rightDom: React.ReactNode;
}

const drag = ({ leftDom: ref1, rightDom: ref2, contentDom }: any, dragLineDom: any) => {
	const _ref1 = ref1;
	const _ref2 = ref2;
	dragLineDom.onmousedown = (e: any) => {
		let _e = e;
		// 点击的时候，有个25px的偏移，先加上，后面在查看原因
		const firstX = _e.clientX + 25; // 获取第一次点击的横坐标
		const width = ref2.offsetWidth; // 获取到元素的宽度
		// 移动过程中对左右元素宽度计算赋值
		document.onmousemove = _event => {
			_e = _event;
			// 可扩展上下拖动等
			_ref1.style.width = `${contentDom.offsetWidth -
				width +
				(_e.clientX - firstX)}px`;
			_ref2.style.width = `${width - (_e.clientX - firstX)}px`;
		};
		// 在左侧和右侧元素父容器上绑定松开鼠标解绑拖拽事件
		contentDom.onmouseup = () => {
			document.onmousemove = null;
		};
		return false;
	};
};

function DragLayout({ contentDom, leftDom, rightDom }: any) {
	const dragLineRef = useRef<any>();
	const prefixCls = 'drag';
	const [fold, setFold] = useState(true);
	const init = useCallback(drag.bind(null, { leftDom, rightDom, contentDom }), [
		leftDom,
		rightDom,
		contentDom,
		dragLineRef.current,
	]);

	useEffect(() => {
		// 初始化绑定拖拽事件
		init(dragLineRef.current);
	}, []);

	useUpdateEffect(() => {
		if (fold) {
			leftDom.style.width = `250px`;
			rightDom.style.width = `${contentDom.offsetWidth - 250}px`;
		} else {
			leftDom.style.width = `0px`;
			rightDom.style.width = `${contentDom.offsetWidth}px`;
		}
	}, [fold]);

	return (
		<div className={`${prefixCls}-wrapper`} ref={dragLineRef}>
			<div className={`${prefixCls}-fold`}>
				{fold ? (
					<a
						onClick={() => {
							setFold(false);
						}}
					>
						隐藏
					</a>
				) : (
					<a
						onClick={() => {
							setFold(true);
						}}
					>
						展开
					</a>
				)}
			</div>
			<div className={`${prefixCls}-line`} />
		</div>
	);
}

const Drag: React.FC<IDrag> = props => {
	const contentRef = useRef<HTMLDivElement>(null);
	const leftDomRef = useRef<HTMLDivElement>(null);
	const rightDomRef = useRef<HTMLDivElement>(null);
	const [init, setInit] = useState(false);
	const prefixCls = 'drag'

	useEffect(() => {
		setInit(true);
	}, []);

	const dragLayoutProps = {
		contentDom: contentRef.current,
		leftDom: leftDomRef.current,
		rightDom: rightDomRef.current,
	};

	return (
		<div className={prefixCls} ref={contentRef}>
			<div className={`${prefixCls}-left`} ref={leftDomRef}>
				{props.leftDom}
			</div>
			{/* 父组件加载完再加载子组件 从而通过ref拿到父组件的dom节点 */}
			{init && <DragLayout {...dragLayoutProps} />}
			<div className={`${prefixCls}-right`} ref={rightDomRef}>
				{props.rightDom}
			</div>
		</div>
	);
};

export default Drag;

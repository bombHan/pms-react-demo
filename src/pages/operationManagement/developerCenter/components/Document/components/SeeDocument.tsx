import React, { useEffect, useRef } from 'react';
import { findDocumentContent } from '../../../servers/api';
import { useSetReactive } from '@pms/middleground-share';
// @ts-ignore
import Prism from '@/utils/wangEditor/prismjs/prism.js';
import '@/utils/wangEditor/prismjs/prism.css';
import '@/utils/wangEditor/view.css';

interface SeeDocumentProps {
	html?: string;
	documentId?: number;
}

function SeeDocument(props: SeeDocumentProps) {
	const { html, documentId } = props;
	const [documentReactive] = useSetReactive({
		html: '',
	});

	// 高亮显示代码
	const highlightAll = () => {
		const timer = setTimeout(() => {
			Prism.highlightAll()
			clearTimeout(timer)
		});
	}

	useEffect(() => {
		if (!!documentId) {
			findDocumentContent(documentId).then(res => {
				documentReactive.html = res.data;
				highlightAll()
			});
			return
		}
		documentReactive.html = html
		highlightAll()
	}, [html, documentId]);

	return (
		<div
			className="editor-content-view"
			dangerouslySetInnerHTML={{ __html: documentReactive.html }}
		></div>
	);
}

export default SeeDocument;

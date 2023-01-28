import type { DataNode } from 'antd/es/tree';

export interface PlusDataNode extends DataNode {
	children?: PlusDataNode[] | undefined
	[propName: string]: any
}

export interface CatalogueProps {
	documentId?: number;
	documentName?: string;
	[propName: string]: any
}

export interface ClassifyTreeProps {
	curCatalogue: CatalogueProps;
	changeCatalogue: (catalogue: CatalogueProps | {}) => void;
}

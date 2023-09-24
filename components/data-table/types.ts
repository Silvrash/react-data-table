

type BaseContextMenuProps<TData> = {
	className?: string;
	onClick?: (d: TData) => void;
	isDisabled?: boolean | ((d: TData) => boolean);
	isHidden?: boolean | ((d: TData) => boolean);
};

export type ContextMenuProps<TData> =
	| ({
			label: React.ReactNode;
			isDivider?: never;
	  } & BaseContextMenuProps<TData>)
	| ({
			isDivider: true;
			label?: never;
	  } & BaseContextMenuProps<TData>);

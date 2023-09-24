"use client";

import {
	OnChangeFn,
	PaginationState,
	Row,
	SortingState,
	TableOptions,
	getCoreRowModel,
	getFilteredRowModel,
	getGroupedRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildActionsColumn, buildContextMenu, buildSelectColumn } from "../helpers";
import { ContextMenuProps } from "../types";

interface DataTableProps<TData> {
	columns: TableOptions<TData>["columns"];
	data: TData[];
	selectable?: boolean;
	actionsLabel?: string;
	actions?: ContextMenuProps<TData>[];
	pageCount?: number;
	tableId: string;
	persisted?: boolean;
	pagination?: PaginationState;
	sorting?: SortingState;
	onPaginationChange?: OnChangeFn<PaginationState>;
	onSortingChange?: OnChangeFn<SortingState>;
	disableFiltering?: boolean;
	isLoading?: boolean;
}

function loadPersisted(tableId: string) {
	if (typeof window !== "undefined") {
		const persisted = localStorage.getItem(`table:${tableId}`);
		if (!persisted) return null;

		return JSON.parse(persisted);
	}
}

function persist(tableId: string, state: any) {
	if (typeof window !== "undefined") {
		localStorage.setItem(`table:${tableId}`, JSON.stringify(state));
	}
}

function useDataTable<TData>({
	tableId,
	columns,
	data,
	selectable,
	actionsLabel = "Actions",
	actions,
	onPaginationChange,
	onSortingChange,
	pageCount,
	persisted = true,
	disableFiltering = true,
	isLoading,
}: DataTableProps<TData>) {
	const _columns = useMemo(() => buildColumns(columns), [selectable, actions]);
	const [isClient, setIsClient] = useState(false);
	const manualPagination = !!onPaginationChange;
	const manualSorting = !!onSortingChange;
	const empty = useRef([]);
	const onSortingChangeFn = useRef({ onSortingChange });
	const onPaginationChangeFn = useRef({ onPaginationChange });

	const table = useReactTable({
		data: isLoading ? empty.current : data,
		columns: !isClient ? empty.current : _columns,
		getCoreRowModel: getCoreRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getPaginationRowModel: !manualPagination ? getPaginationRowModel() : undefined,
		getFilteredRowModel: !disableFiltering ? getFilteredRowModel() : undefined,
		getSortedRowModel: !manualSorting ? getSortedRowModel() : undefined,
		manualPagination,
		manualSorting,
		pageCount,
		columnResizeMode: "onChange",
		groupedColumnMode: "remove",
		enableGrouping: true,
		// local pagination stops working when an object exists for pagination or sorting
		// even when it's undefined
		...(onSortingChange ? onSortingChangeFn.current : undefined),
		...(onPaginationChange ? onPaginationChangeFn.current : undefined),
		debugAll: false,
	});

	useEffect(() => {
		const persistedState = persisted && loadPersisted(tableId);
		table.setState({
			sorting: persistedState?.sorting ?? [],
			columnFilters: persistedState?.columnFilters ?? [],
			columnVisibility: persistedState?.columnVisibility ?? {},
			columnOrder: persistedState?.columnOrder ?? _columns.map((column) => column.id as string),
			columnPinning: persistedState?.columnPinning ?? {},
			pagination: persistedState?.pagination ?? { pageIndex: 0, pageSize: 10 },
			columnSizing: persistedState?.columnSizing ?? {},
			rowSelection: persistedState?.rowSelection ?? {},
			columnSizingInfo: persistedState?.columnSizingInfo ?? {},
			expanded: persistedState?.expanded ?? {},
			globalFilter: persistedState?.globalFilter ?? "",
			grouping: persistedState?.grouping ?? [],
		});

		setIsClient(true);
	}, []);

	useEffect(() => {
		if (!isClient) return;

		const selectColumn = table.getColumn("select");
		const actionsColumn = table.getColumn("actions");
		if (selectable && !selectColumn?.getIsPinned()) selectColumn?.pin("left");
		if (actions?.length && !actionsColumn?.getIsPinned()) actionsColumn?.pin("right");
	}, [isClient]);

	function buildColumns(_columns: typeof columns) {
		const values = _columns.slice(0);

		if (actions?.length) values.push(buildActionsColumn({ label: actionsLabel, actions }));
		if (selectable) values.unshift(buildSelectColumn());

		return values;
	}

	function wrapContextMenu(row: Row<TData>, trigger: React.ReactNode) {
		return buildContextMenu(row, trigger, { label: actionsLabel, actions });
	}

	const getTotalRows = useCallback(() => {
		if (manualPagination) return data.length;
		return table.getRowModel().rows.length;
	}, [data.length]);

	function getColumnOffset(columnId: string, position: "left" | "right") {
		let offset = 0;

		table.getHeaderGroups().forEach((headerGroup) => {
			const header = headerGroup.headers.find((header) => header.column.id === columnId);
			if (!header) return;
			if (position === "left") offset = header.getStart();
			if (position === "right") {
				const end = table.getTotalSize() - header.getStart();
				const rightIndex = headerGroup.headers.length - header.index - 1;
				offset = end * rightIndex;
			}
		});
		return offset;
	}

	useEffect(() => {
		persist(tableId, table.getState());
	}, [table.getState()]);

	return { ...table, wrapContextMenu, getTotalRows, getColumnOffset };
}

export default useDataTable;

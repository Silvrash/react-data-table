"use client";

import { TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Cell, Header, HeaderGroup, Row, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { Children, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ConditionRender from "../ConditionRender";
import { Skeleton } from "../ui/skeleton";
import useDataTable from "./hooks/useDataTable";
import "./styles.css";
import { DataTablePagination } from "./ui/DataTablePagination";
import DraggableTableHead from "./ui/DraggableTableHead";

interface DataTableProps<TData> {
	caption?: string;
	bordered?: boolean;
	table: ReturnType<typeof useDataTable<TData>>;
	isLoading?: boolean;
	estimatedRowHeight?: (index: number) => number;
}

// const hideScrollBar = css`
// 	::-webkit-scrollbar {
// 		display: none;
// 	}
// `;

function DataTable<TData>({ caption, table, bordered = true, estimatedRowHeight, isLoading }: DataTableProps<TData>) {
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const estimatedRowHeightRef = useRef(estimatedRowHeight ?? (() => 40));

	const isEmpty = !table.getTotalRows() && !isLoading;
	const headerGroups = table.getHeaderGroups();
	// const rowVirtualizer = useVirtual({
	// 	parentRef: tableContainerRef,
	// 	size: table.getTotalRows(),
	// 	overscan: 10,
	// 	estimateSize: estimatedRowHeightRef.current,
	// });
	// const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

	const rowVirtualizer = useVirtualizer({
		count: table.getTotalRows(),
		getScrollElement: () => tableContainerRef.current,
		estimateSize: estimatedRowHeightRef.current,
		overscan: 10,
	});

	const virtualRows = rowVirtualizer.getVirtualItems();
	const totalSize = rowVirtualizer.getTotalSize();

	const paddingTop = !isLoading && virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
	const paddingBottom =
		!isLoading && virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

	function renderHeader(headerGroup: HeaderGroup<TData>) {
		const allRowsHidden = headerGroup.headers.every(
			(header) => !header.column.getIsVisible() || header.isPlaceholder
		);
		if (allRowsHidden) return null;
		return (
			<TableRow key={headerGroup.id} className="border-none">
				{headerGroup.headers.map(renderHeaderCell)}
			</TableRow>
		);
	}

	const cellShadowStyle = bordered ? "inset -1px 0 0 hsl(var(--border)), -1px 0 0 hsl(var(--border))" : undefined;

	function renderHeaderCell<TValue>(header: Header<TData, TValue>, index: number) {
		const isFirst = header.depth === 0 && isFirstColumn(header.column.id);
		const isLast = isLastColumn(header.column.id);
		const nextHeader = headerGroups[header.column.depth]?.headers[index + 1];
		const isNextColumnActions = nextHeader?.column.id === "actions";
		let boxShadow = cellShadowStyle;
		const groupDividerBottom = "inset 0 -1px 0 hsl(var(--border))";

		if (!boxShadow) boxShadow = groupDividerBottom;
		else if (bordered ) boxShadow = `${boxShadow}, ${groupDividerBottom}`;
		if (!header.column.getIsVisible()) return null;
		if (header.column.parent && !header.column.parent.getIsVisible()) return null;
		return (
			<DraggableTableHead
				key={header.id}
				header={header}
				table={table}
				className={clsx("bg-background shadow z-20", {
					"rounded-tl-md": isFirst,
					"rounded-tr-md": isLast,
				})}
				style={{
					boxShadow: !isLast && !isNextColumnActions ? boxShadow : groupDividerBottom,
				}}
			/>
		);
	}

	function renderRow(row: Row<TData>) {
		return table.wrapContextMenu(
			row,
			<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
				{row.getVisibleCells().map(renderBodyCell)}
			</TableRow>
		);
	}

	function renderSkeletonRow() {
		function renderCell(column: Header<TData, any>) {
			if (column.subHeaders.length) return null;

			return (
				<TableCell key={column.id} className="w-fit" style={{ boxShadow: cellShadowStyle }}>
					<Skeleton className="w-full h-[20px] rounded-md" />
				</TableCell>
			);
		}
		return <TableRow>{table.getHeaderGroups().map((headerGroup) => headerGroup.headers.map(renderCell))}</TableRow>;
	}
	console.log("columnOrder", table.getState().columnOrder);

	function isLastColumn(columnId: string) {
		return headerGroups.some((group) => group.headers?.[group.headers.length - 1]?.column.id === columnId);
	}

	function isFirstColumn(columnId: string) {
		return headerGroups[0]?.headers?.[0]?.column.id === columnId;
	}

	function renderBodyCell(cell: Cell<TData, any>, index: number) {
		const isPinned = cell.column.getIsPinned();
		const isPinnedLeft = isPinned === "left";
		const isPinnedRight = isPinned === "right";
		const isNextColumnActions = headerGroups[cell.column.depth]?.headers[index + 1]?.column.id === "actions";

		const isLast = isLastColumn(cell.column.id);

		if (cell.column.parent && !cell.column.parent?.getIsVisible()) return null;

		return (
			<TableCell
				key={cell.id}
				data-column={cell.column.id}
				className={clsx("text-xs bg-background", {
					"sticky top-0 z-[10]": isPinned,
				})}
				style={{
					boxShadow: !isLast && !isNextColumnActions ? cellShadowStyle : undefined,
					width: cell.column.getSize(),
					left: isPinnedLeft ? table.getColumnOffset(cell.column.id, "left") : undefined,
					right: isPinnedRight ? table.getColumnOffset(cell.column.id, "right") : undefined,
				}}
			>
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</TableCell>
		);
	}

	function renderEmpty() {
		return (
			<TableRow>
				<TableCell colSpan={table.getAllFlatColumns().length} className="h-24 text-center">
					No results.
				</TableCell>
			</TableRow>
		);
	}

	function renderTableContent() {
		if (isLoading) return renderSkeletonRow();
		if (isEmpty) return renderEmpty();
		return Children.toArray(virtualRows.map((virtualRow) => renderRow(table.getRowModel().rows[virtualRow.index])));
	}

	const estimatedNextRowHeight = estimatedRowHeightRef.current(virtualRows[virtualRows.length - 1]?.index || 0);
	const estimatedRowsToRenderTop = Math.ceil(paddingTop / estimatedNextRowHeight);
	const estimatedRowsToRenderBottom = Math.ceil(paddingBottom / estimatedNextRowHeight);

	return (
		<DndProvider backend={HTML5Backend}>
			<div
				className={clsx(
					"data-table-content",
					"rounded-md border overflow-y-auto transition-transform duration-75"
				)}
				style={{
					maxHeight: "calc(100vh - 290px)",
				}}
			>
				<table
					ref={tableContainerRef as any}
					className="!w-[-webkit-fill-available] relative border-collapse"
					style={{ width: table.getCenterTotalSize() }}
				>
					<ConditionRender.TableCaption renderIf={!!caption}>{caption}</ConditionRender.TableCaption>
					<TableHeader className="sticky top-0 z-20">{headerGroups.map(renderHeader)}</TableHeader>

					<TableBody className="z-0">
						{Children.toArray(Array(estimatedRowsToRenderTop).fill(renderSkeletonRow()))}

						{renderTableContent()}

						{Children.toArray(Array(estimatedRowsToRenderBottom).fill(renderSkeletonRow()))}
					</TableBody>
				</table>
			</div>
			<div className="sticky bottom-0 left-0 right-0 bg-background z-10">
				<DataTablePagination table={table} />
			</div>
		</DndProvider>
	);
}

export default DataTable;

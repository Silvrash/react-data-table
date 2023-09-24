import ConditionRender from "@/components/ConditionRender";
import { Column, ColumnOrderState, Header } from "@tanstack/react-table";
import clsx from "clsx";
import { CSSProperties, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { TableHead } from "../../ui/table";
import useDataTable from "../hooks/useDataTable";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

interface DraggableTableHeadProps<TData, TValue> {
	header: Header<TData, TValue>;
	table: ReturnType<typeof useDataTable<TData>>;
	className?: string;
	style?: CSSProperties;
	isLast?: boolean;
}

function DraggableTableHead<TData, TValue>({
	header,
	table,
	className,
	style,
}: DraggableTableHeadProps<TData, TValue>) {
	const setColumnOrder = useRef(table.setColumnOrder).current;

	const { column } = header;

	const isPinned = column.getIsPinned();
	const isPinnedLeft = isPinned === "left";
	const isPinnedRight = isPinned === "right";
	const canDrag = column.getCanResize() && !isPinned && !header.isPlaceholder;

	const [{ isDragging }, dragRef] = useDrag({
		type: "COLUMN_DRAG",
		item: () => column,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		canDrag,
	});

	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: "COLUMN_DRAG",
		drop: (draggedColumn: Column<TData>) => {
			const newColumnOrder = reorderColumn(draggedColumn.id, column.id);
			setColumnOrder(newColumnOrder);
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
		canDrop: (draggedColumn: Column<TData>) => {
			draggedColumn;
			const canDrop =
				draggedColumn.getIsPinned() === isPinned &&
				draggedColumn.depth === column.depth &&
				!header.isPlaceholder;
			return canDrop;
		},
	});

	function reorderColumn(draggedColumnId: string, targetColumnId: string): ColumnOrderState {
		const columnOrder = [...table.getState().columnOrder];
		console.log("before", columnOrder, table.getState().grouping);
		columnOrder.splice(
			columnOrder.indexOf(targetColumnId),
			0,
			columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
		);
		console.log("after", columnOrder);
		return columnOrder;
	}

	return (
		<TableHead
			key={header.id}
			data-column={header.column.id}
			colSpan={header.colSpan}
			className={clsx(className, "px-0", {
				"cursor-move": canDrag,
				"bg-background opacity-100": !isDragging && isPinned,
				"opacity-50 cursor-grabbing": isDragging,
				"bg-gray-200": isOver && canDrop,
				"sticky top-0 z-[1] md:data-[column=actions]:sticky": isPinned,
			})}
			ref={dropRef}
			style={{
				...style,
				width: header.getSize(),
				minWidth: header.getSize(),
				maxWidth: header.getSize(),
				left: isPinnedLeft ? table.getColumnOffset(column.id, "left") : undefined,
				right: isPinnedRight ? table.getColumnOffset(column.id, "right") : undefined,
			}}
		>
			{header.isPlaceholder ? null : (
				<div className="flex flex-row justify-between relative group h-full">
					<DataTableColumnHeader
						column={column}
						header={header}
						ref={dragRef}
						className={clsx("px-2", (column.columnDef.meta as any)?.className)}
					/>

					<ConditionRender.Separator
						renderIf={!!column.getCanResize()}
						orientation="vertical"
						onMouseDown={header.getResizeHandler()}
						onTouchStart={header.getResizeHandler()}
						className={clsx(
							"absolute right-0 top-0 h-8 group-hover:w-1 bg-black/50 cursor-col-resize select-none touch-none opacity-0 group-hover:opacity-100",
							{ "bg-gray-500 opacity-100 w-1": header.column.getIsResizing() }
						)}
					/>
				</div>
			)}
		</TableHead>
	);
}

export default DraggableTableHead;

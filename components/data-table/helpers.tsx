import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row, createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";

import { Children } from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "../ui/context-menu";
import {
	DropdownArrow,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ContextMenuProps } from "./types";

interface ActionProps<TData> {
	label?: string;
	actions?: ContextMenuProps<TData>[];
}

export function buildActionsColumn<TData>({ label, actions }: ActionProps<TData>) {
	const columnHelper = createColumnHelper<TData>();
	return columnHelper.display({
		id: "actions",
		enableSorting: false,
		enableHiding: false,
		enableColumnFilter: false,
		enableResizing: false,
		enablePinning: false,
		size: 30,
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="flex mx-auto">
						<Button variant="ghost" className="md:h-6 md:w-6 p-0 bg-background rounded-full">
							<span className="sr-only">Open menu</span>
							<DotsHorizontalIcon className="w-3 h-3 md:h-4 md:w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel className="text-xs">{label}</DropdownMenuLabel>
						{!!label && <DropdownMenuSeparator />}
						{Children.toArray(actions?.map((action) => renderAction(row.original, action)))}
						<DropdownArrow className="hidden md:block" />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	});
}

export function buildContextMenu<TData>(
	row: Row<TData>,
	trigger: React.ReactNode,
	{ label, actions }: ActionProps<TData>
) {
	const isDisabled = !actions?.length;

	return (
		<ContextMenu>
			<ContextMenuTrigger disabled={isDisabled} asChild className={clsx({ "cursor-pointer": !isDisabled })}>
				{trigger}
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuLabel className="text-xs">{label}</ContextMenuLabel>
				{!!label && <ContextMenuSeparator />}
				{Children.toArray(
					actions?.map((action) => renderAction(row.original, action, ContextMenuSeparator, ContextMenuItem))
				)}
			</ContextMenuContent>
		</ContextMenu>
	);
}

function renderAction<TData>(
	row: TData,
	action: ContextMenuProps<TData>,
	Separator = DropdownMenuSeparator,
	Item = DropdownMenuItem
) {
	const isDisabled = typeof action.isDisabled === "function" ? action.isDisabled(row) : action.isDisabled;
	const isHidden = typeof action.isHidden === "function" ? action.isHidden(row) : action.isHidden;
	const onClick = () => action.onClick?.(row);

	if (isHidden) return null;

	if (action.isDivider) return <Separator />;

	if (!action.label) throw Error("Label is required for context menu");

	const cursor = isDisabled ? "cursor-not-allowed" : "cursor-pointer";

	return (
		<Item disabled={isDisabled} onClick={onClick} className={clsx(action.className, cursor, "text-xs")}>
			{action.label}
		</Item>
	);
}

export function buildSelectColumn<TData>() {
	const columnHelper = createColumnHelper<TData>();
	return columnHelper.display({
		id: "select",
		enableSorting: false,
		enableHiding: false,
		enablePinning: false,
		enableColumnFilter: false,
		enableResizing: false,
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		size: 40,
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
	});
}

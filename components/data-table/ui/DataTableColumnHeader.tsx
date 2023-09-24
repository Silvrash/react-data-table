import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import { Column, Header, flexRender } from "@tanstack/react-table";

import {
	DropdownArrow,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DrawingPinFilledIcon, DrawingPinIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement>,
		React.PropsWithChildren {
	column: Column<TData, TValue>;
	title?: string;
	header?: Header<TData, TValue>;
}

export const DataTableColumnHeader = forwardRef(
	(props: DataTableColumnHeaderProps<any, any>, ref: ForwardedRef<HTMLDivElement>) => {
		const { column, title, className, header, children } = props;

		const hideDivider = !column.getIsPinned() && !column.getCanSort();
		const hideActions = !column.getCanHide() && !column.getCanPin() && !column.getCanSort();

		function renderTitle() {
			if (title) return title;
			if (!header) return null;
			return flexRender(column.columnDef.header, header.getContext());
		}

		function recursivelyHideSubHeaders(header?: Header<any, any>) {
			header?.subHeaders?.forEach((subHeader) => {
				subHeader.column.toggleVisibility(false);
				recursivelyHideSubHeaders(subHeader);
			});
		}

		const PinMenuIcon = column.getIsPinned() ? DrawingPinFilledIcon : DrawingPinIcon;

		return (
			<div ref={ref} className={cn("w-full h-full my-auto space-x-2 text-xs", className)}>
				<div className={clsx("my-auto flex items-center h-full", { "mr-auto": hideActions })}>
					{renderTitle()}
					<DropdownMenu>
						<DropdownMenuTrigger className={clsx("ml-3", hideActions && "hidden")} asChild>
							{column.getIsSorted() === "desc" ? (
								<ArrowDownIcon className="h-4 w-4 cursor-pointer" />
							) : column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="h-4 w-4 cursor-pointer" />
							) : (
								<CaretSortIcon className="h-4 w-4 cursor-pointer" />
							)}
						</DropdownMenuTrigger>
						{children}

						<DropdownMenuContent align="start">
							<DropdownMenuItem
								className={clsx("cursor-pointer", !column.getCanSort() && "hidden")}
								onClick={() => column.toggleSorting(false)}
							>
								<ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
								Asc
							</DropdownMenuItem>
							<DropdownMenuItem
								className={clsx("cursor-pointer", !column.getCanSort() && "hidden")}
								onClick={() => column.toggleSorting(true)}
							>
								<ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
								Desc
							</DropdownMenuItem>
							<DropdownMenuSeparator className={clsx(hideDivider && "hidden")} />
							<DropdownMenuItem
								className={clsx("cursor-pointer", !column.getCanPin() && "hidden")}
								onClick={() => column.pin(!column.getIsPinned() ? "left" : false)}
							>
								<PinMenuIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
								{column.getIsPinned() ? "Unpin" : "Pin"}
							</DropdownMenuItem>
							<DropdownMenuItem
								className={clsx(
									"cursor-pointer",
									(!column.getCanHide() || !column.getToggleVisibilityHandler()) && "hidden"
								)}
								onClick={() => {
									column.toggleVisibility(false);
									recursivelyHideSubHeaders(header);
								}}
							>
								<EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
								Hide
							</DropdownMenuItem>
							<DropdownArrow />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		);
	}
);

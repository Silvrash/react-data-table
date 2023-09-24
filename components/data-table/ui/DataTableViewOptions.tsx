import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Column, Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	function recursivelyShowParentColumnsIfHidden(column: Column<TData>) {
		if (column.parent) {
			if (!column.parent.getIsVisible()) {
				column.parent.toggleVisibility(true);
			}
			recursivelyShowParentColumnsIfHidden(column.parent);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
					<MixerHorizontalIcon className="mr-2 h-4 w-4" />
					Columns
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="min-w-[150px] overflow-y-auto relative"
				style={{ maxHeight: "calc(100vh - 300px)" }}
			>
				<DropdownMenuLabel className="sticky top-0 bg-background z-10">Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllFlatColumns()
					.filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className={clsx("capitalize")}
								checked={column.getIsVisible() && (column.parent?.getIsVisible() ?? true)}
								onCheckedChange={(value) => {
									column.toggleVisibility(!!value);
									recursivelyShowParentColumnsIfHidden(column);
								}}
							>
								{column.id.split(".").join(" ")}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

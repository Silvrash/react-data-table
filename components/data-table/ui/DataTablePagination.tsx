import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
	return (
		<div className="flex items-center justify-between p-2">
			<div className="flex-1 text-xs text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
				selected.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<p className="text-xs text-muted-foreground">Rows per page</p>
				<div className="flex items-center space-x-2">
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50, 100].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
									className="text-xs text-muted-foreground"
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-auto items-center justify-center text-xs  text-muted-foreground">
					Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className={clsx("hidden h-8 w-8 p-0 lg:flex disabled:cursor-not-allowed")}
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<DoubleArrowLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className={clsx("h-8 w-8 p-0 disabled:cursor-not-allowed")}
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className={clsx("h-8 w-8 p-0 disabled:cursor-not-allowed")}
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className={clsx("hidden h-8 w-8 p-0 lg:flex disabled:cursor-not-allowed")}
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<DoubleArrowRightIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

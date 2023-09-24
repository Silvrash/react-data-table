"use client";

import DataTable from "@/components/data-table/DataTable";
import useDataTable from "@/components/data-table/hooks/useDataTable";
import { ContextMenuProps } from "@/components/data-table/types";
import { DataTableViewOptions } from "@/components/data-table/ui/DataTableViewOptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Payment = {
	id: string;
	amount: number;
	status: "pending" | "processing" | "success" | "failed";
	email: string;
	picture: string;
	name: string;
	city: string;
	country: string;
	phoneNumber: string;
	streetAddress: string;
};

const columnHelper = createColumnHelper<Payment>();

// const faker = require('@faker-js/faker').faker
// const fs = require('fs')
// fs.writeFileSync('./app/data.json', JSON.stringify(Array.from({ length: 10000 }, (_, idx) => ({
// 	id: faker.string.nanoid(),
// 	amount: faker.number.float({ precision: 0.2 }),
// 	status: ["pending", "processing", "success", "failed"][faker.number.int({ min: 0, max: 3 })],
// 	email: faker.internet.email(),
// 	picture: faker.internet.avatar(),
// 	name: faker.person.fullName(),
// 	city: faker.location.city(),
// 	country: faker.location.country(),
// 	phoneNumber: faker.phone.number(),
// 	streetAddress: faker.location.streetAddress(),
// })), null, 2))

const data: Payment[] = require("./data.json");

function getInitials(name: string) {
	const [first, last] = name.split(" ");
	return `${first[0]}${last?.[0] ?? ""}`;
}

const columns = [
	columnHelper.accessor("picture", {
		id: "picture",
		header: "Picture",
		size: 80,
		cell: ({ row }) => {
			return (
				<Avatar className="w-8 h-8 mx-auto">
					<AvatarImage src={row.getValue("picture")} />
					<AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
				</Avatar>
			);
		},
	}),
	columnHelper.accessor("name", {
		id: "name",
		header: "Name",
	}),
	columnHelper.accessor("id", {
		id: "count",
		size: 60,
		sortingFn: (rowA, rowB) => {
			const numA = rowA.index;
			const numB = rowB.index;

			return numA < numB ? -1 : numA > numB ? 1 : 0;
		},
		header: "No.",
		cell: ({ row }) => row.index + 1,
	}),
	columnHelper.accessor("status", { id: "status", header: "Status" }),
	columnHelper.accessor("email", { id: "email", header: "Email" }),
	columnHelper.accessor("amount", {
		id: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div className="font-medium">{formatted}</div>;
		},
	}),

	columnHelper.accessor("city", { id: "city", header: "City" }),
	columnHelper.accessor("country", { id: "country", header: "Country" }),
	columnHelper.accessor("streetAddress", { id: "streetAddress", header: "Street address" }),
	columnHelper.accessor("phoneNumber", { id: "phoneNumber", header: "Phone number" }),
];

const actions: ContextMenuProps<Payment>[] = [
	{ label: "Copy payment ID", onClick: (payment) => navigator.clipboard.writeText(payment.id) },
	{ isDivider: true },
	{ label: "View customer" },
	{ label: "View payment details", isDisabled: true },
];

interface Props {
	selectable?: boolean;
	bordered?: boolean;
}
export default function FixedData({ selectable, bordered }: Props) {
	const [isLoading, setIsLoading] = useState(true);
	const [values, setValues] = useState<Payment[]>([]);

	const table = useDataTable({
		tableId: "fixed-data",
		columns,
		data: values,
		actions,
		selectable,
		isLoading,
        onPaginationChange: ()=>{}
	});

	useEffect(() => {
		setValues(data.slice(0, 300));
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}, [isLoading]);

	return (
		<>
			<div className={clsx("py-4")}>
				<DataTableViewOptions table={table} />
			</div>
			<DataTable table={table} isLoading={isLoading} bordered={bordered} />
		</>
	);
}

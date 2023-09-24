"use client";

import DataTable from "@/components/data-table/DataTable";
import useDataTable from "@/components/data-table/hooks/useDataTable";
import { ContextMenuProps } from "@/components/data-table/types";
import { DataTableViewOptions } from "@/components/data-table/ui/DataTableViewOptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	maidenName: string;
	age: number;
	gender: string;
	email: string;
	phone: string;
	username: string;
	password: string;
	birthDate: Date;
	image: string;
	bloodGroup: string;
	height: number;
	weight: number;
	eyeColor: string;
	hair: Hair;
	domain: string;
	ip: string;
	address: Address;
	macAddress: string;
	university: string;
	bank: Bank;
	company: Company;
	ein: string;
	ssn: string;
	userAgent: string;
}

export interface Address {
	address: string;
	city: string;
	coordinates: Coordinates;
	postalCode: string;
	state: string;
}

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface Bank {
	cardExpire: string;
	cardNumber: string;
	cardType: string;
	currency: string;
	iban: string;
}

export interface Company {
	address: Address;
	department: string;
	name: string;
	title: string;
}

export interface Hair {
	color: string;
	type: string;
}

const columnHelper = createColumnHelper<User>();

const columns = [
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
	columnHelper.accessor("image", {
		id: "image",
		header: "Image",
		size: 80,
		cell: ({ row }) => {
			return (
				<Avatar className="w-8 h-8 mx-auto">
					<AvatarImage src={row.getValue("image")} />
					<AvatarFallback>
						{row.original.firstName.charAt(0) + row.original.lastName.charAt(0)}
					</AvatarFallback>
				</Avatar>
			);
		},
	}),
	columnHelper.accessor("firstName", {
		id: "firstName",
		header: "First Name",
	}),
	columnHelper.accessor("lastName", {
		id: "lastName",
		header: "Last Name",
	}),
	columnHelper.accessor("maidenName", {
		id: "maidenName",
		header: "Maiden Name",
	}),
	columnHelper.accessor("age", {
		id: "age",
		header: "Age",
	}),
	columnHelper.accessor("gender", {
		id: "gender",
		header: "Gender",
	}),
	columnHelper.accessor("email", {
		id: "email",
		header: "Email",
	}),
	columnHelper.accessor("phone", {
		id: "phone",
		header: "Phone",
	}),
	columnHelper.accessor("username", {
		id: "username",
		header: "Username",
	}),
	columnHelper.accessor("password", {
		id: "password",
		header: "Password",
	}),
	columnHelper.accessor("birthDate", {
		id: "birthDate",
		header: "Birth Date",
	}),
	columnHelper.accessor("bloodGroup", {
		id: "bloodGroup",
		header: "Blood Group",
	}),
	columnHelper.accessor("height", {
		id: "height",
		header: "Height",
	}),
	columnHelper.accessor("weight", {
		id: "weight",
		header: "Weight",
	}),
	columnHelper.accessor("eyeColor", {
		id: "eyeColor",
		header: "Eye Color",
	}),
	columnHelper.group({
		id: "Hair",
		header: () => <span className="w-full text-center">Hair</span>,
		columns: [
			columnHelper.accessor("hair.color", {
				id: "hair.color",
				header: "Color",
			}),
			columnHelper.accessor("hair.type", {
				id: "hair.type",
				header: "Type",
			}),
		],
	}),
	columnHelper.accessor("domain", {
		id: "domain",
		header: "Domain",
	}),
	columnHelper.accessor("ip", {
		id: "ip",
		header: "IP",
	}),
	columnHelper.group({
		id: "address",
		header: () => <span className="w-full text-center">Address L1</span>,
		columns: [
			columnHelper.accessor("address.address", {
				id: "address.address",
				header: "Address",
			}),
			columnHelper.accessor("address.city", {
				id: "address.city",
				header: "City",
				cell: ({ row }) => row.getValue("address.city"),
			}),
			columnHelper.accessor("address.coordinates.lat", {
				id: "address.coordinates.lat",
				header: "Latitude",
			}),
			columnHelper.accessor("address.coordinates.lng", {
				id: "address.coordinates.lng",
				header: "Longitude",
			}),
			columnHelper.accessor("address.postalCode", {
				id: "address.postalCode",
				header: "Postal Code",
			}),
			columnHelper.accessor("address.state", {
				id: "address.state",
				header: "State",
			}),
			columnHelper.group({
				id: "address.l2",
				header: () => <span className="w-full text-center">Address Level 2</span>,
				columns: [
					columnHelper.accessor("address.address", {
						id: "address.l2.address",
						header: "L2 Address",
					}),
					columnHelper.accessor("address.city", {
						id: "address.l2.city",
						header: "L2 City",
						cell: ({ row }) => row.getValue("address.city"),
					}),
					columnHelper.group({
						id: "address.l3",
						header: () => <span className="w-full text-center">Address Level 3</span>,

						columns: [
							columnHelper.accessor("address.address", {
								id: "address.l3.address",
								enableHiding: false,
								enablePinning: false,
								enableSorting: false,
								header: () => <span className="w-full text-right">L3 Address</span>,
								cell: ({ row }) => (
									<div className="text-right">{row.getValue("address.address")}</div>
								),
							}),
							columnHelper.accessor("address.city", {
								id: "address.l3.city",
								header: "L3 City",
								cell: ({ row }) => row.getValue("address.city"),
							}),
						],
					}),
				],
			}),
		],
	}),
	columnHelper.accessor("macAddress", {
		id: "macAddress",

		header: "Mac Address",
	}),
	columnHelper.group({
		id: "Bank",
		header: () => <span className="w-full text-center">Bank</span>,
		columns: [
			columnHelper.accessor("bank.cardExpire", {
				id: "bank.cardExpire",
				header: "Card Expire",
			}),
			columnHelper.accessor("bank.cardNumber", {
				id: "bank.cardNumber",
				header: "Card Number",
			}),
			columnHelper.accessor("bank.cardType", {
				id: "bank.cardType",
				header: "Card Type",
			}),
			columnHelper.accessor("bank.currency", {
				id: "bank.currency",
				header: "Currency",
			}),
			columnHelper.accessor("bank.iban", {
				id: "bank.iban",
				header: "IBAN",
			}),
		],
	}),
	columnHelper.group({
		id: "Company",
		header: () => <span className="w-full text-center">Company</span>,
		columns: [
			columnHelper.accessor("company.name", {
				id: "company.name",
				header: "Name",
			}),
			columnHelper.accessor("company.title", {
				id: "company.title",
				header: "Title",
			}),
			columnHelper.accessor("company.address.address", {
				id: "company.address.address",
				header: "Address",
			}),
			columnHelper.accessor("company.address.city", {
				id: "company.address.city",
				header: "City",
				cell: ({ row }) => row.getValue("company.address.city") ?? "",
			}),
			columnHelper.accessor("company.address.coordinates.lat", {
				id: "company.address.coordinates.lat",
				header: "Latitude",
			}),
			columnHelper.accessor("company.address.coordinates.lng", {
				id: "company.address.coordinates.lng",
				header: "Longitude",
			}),
			columnHelper.accessor("company.address.postalCode", {
				id: "company.address.postalCode",
				header: "Postal Code",
			}),
			columnHelper.accessor("company.address.state", {
				id: "company.address.state",
				header: "State",
			}),
			columnHelper.accessor("company.department", {
				id: "company.department",
				header: "Department",
			}),
		],
	}),
	columnHelper.accessor("ein", {
		id: "ein",
		header: "EIN",
	}),
	columnHelper.accessor("ssn", {
		id: "ssn",
		header: "SSN",
	}),
	columnHelper.accessor("userAgent", {
		id: "userAgent",
		header: "User Agent",
	}),
];

const actions: ContextMenuProps<User>[] = [
	{
		label: "Edit",
		onClick: (user) => {
			console.log(user);
		},
	},
	{
		label: "Delete",
		onClick: (user) => {
			console.log(user);
		},
	},
	{ isDivider: true },
	{ label: "View customer" },
	{ label: "View payment details", isDisabled: true },
];

interface Props {
	selectable?: boolean;
	bordered?: boolean;
}
export default function RemoteData({ selectable, bordered }: Props) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<User[]>([]);
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageCount, setPageCount] = useState(0);

	const table = useDataTable({
		tableId: "remote-data",
		columns,
		data: data,
		actions,
		selectable,
		isLoading,
		pageCount,
		pagination,
		sorting,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
	});

	useEffect(fetchData, [pagination, sorting]);

	function fetchData() {
		setIsLoading(true);
		const offset = pagination.pageIndex * pagination.pageSize;
		fetch(`https://dummyjson.com/users?limit=${pagination.pageSize}&skip=${offset}`)
			.then((res) => res.json())
			.then((res) => {
				setData(res.users);
				setPageCount(res.total);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	return (
		<>
			<div className={clsx("py-4")}>
				<DataTableViewOptions table={table} />
			</div>
			<DataTable table={table} isLoading={isLoading} bordered={bordered} />
		</>
	);
}

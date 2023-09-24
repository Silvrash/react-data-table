"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import FixedData from "./FixedData";
import RemoteData from "./RemoteData";

export default function Home() {
	const [selectable, setSelectable] = useState(true);
	const [bordered, setBordered] = useState(true);
	const [remote, setRemote] = useState(true);

	return (
		<main className="container py-3">
			<div className="flex gap-2">
				<Button variant={!bordered ? "outline" : "default"} onClick={() => setBordered((v) => !v)}>
					Bordered
				</Button>
				<Button variant={!selectable ? "outline" : "default"} onClick={() => setSelectable((v) => !v)}>
					Selectable
				</Button>

				<Button variant={!remote ? "outline" : "default"} onClick={() => setRemote((v) => !v)}>
					Remote Data
				</Button>
			</div>

			{!remote && <FixedData selectable={selectable} bordered={bordered} />}
			{remote && <RemoteData selectable={selectable} bordered={bordered} />}
		</main>
	);
}

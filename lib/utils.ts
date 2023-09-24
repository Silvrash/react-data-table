import { clsx } from "clsx";
import { ClassNameValue, twMerge } from "tailwind-merge";

export function cn(...inputs: ClassNameValue[]) {
	return twMerge(clsx(inputs));
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const subMinutes = (date: Date, minutes: number) => {
	const result = new Date(date);
	result.setMinutes(result.getMinutes() - minutes);
	return result;
};

export const subHours = (date: Date, hours: number) => {
	const result = new Date(date);
	result.setHours(result.getHours() - hours);
	return result;
};

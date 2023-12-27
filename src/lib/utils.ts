import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function startOfDay() {
  var start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

export function formatDate(date) {
  let day = date.getDate();

  let month = date.getMonth();

  let year = date.getFullYear();

  return `${month + 1 + "/" + day + "/" + year}`;
}

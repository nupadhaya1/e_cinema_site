import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";

export type stateTuple<T> = [T, Dispatch<SetStateAction<T>>];

export function formatDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); 
    const dd = String(date.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
}

export function prettyDateString(s: string) { //yyyy-mm-dd format
    let ss = s.split("-");
    return format(new Date(Number(ss[0]), Number(ss[1]) - 1, Number(ss[2])), "PPP")
}


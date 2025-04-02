import { Dispatch, SetStateAction } from "react";
export type stateTuple<T> = [T, Dispatch<SetStateAction<T>>];


export function formatDateString(dateString: string | Date): string {
    const date = new Date(dateString)

    const year = date.toLocaleString('default', { year: 'numeric' })
    const month = date.toLocaleString('default', { month: '2-digit' })
    const day = date.toLocaleString('default', { day: '2-digit' })

    // Generate yyyy-mm-dd date string
    return year + '-' + month + '-' + day
}
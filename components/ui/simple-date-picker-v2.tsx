"use client"
import { CustomDatePicker } from "@/components/ui/custom-date-picker"

interface SimpleDatePickerV2Props {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function SimpleDatePickerV2({ date, setDate }: SimpleDatePickerV2Props) {
  return <CustomDatePicker date={date} setDate={setDate} />
}


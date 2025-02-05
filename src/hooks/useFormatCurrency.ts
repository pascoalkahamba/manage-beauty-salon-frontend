import { useMemo } from "react";
import { formatCurrency } from "@/utils/formatters";

export const useFormatCurrency = (value: number) => {
  const formattedValue = useMemo(() => formatCurrency(value), [value]);
  return formattedValue;
};

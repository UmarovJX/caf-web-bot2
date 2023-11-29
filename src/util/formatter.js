export function formatToPrice(rawPrice, decimalCount = 0) {
  if (!rawPrice) return 0;

  if (typeof rawPrice === "string") {
    rawPrice = parseFloat(rawPrice);
  }

  const dollarUSLocale = Intl.NumberFormat("en-US");
  const price = dollarUSLocale.format(parseInt(rawPrice));
  const result = price.toLocaleString().replace(/,/g, "  ");

  if (decimalCount) {
    const decimalValue = (rawPrice % 1).toFixed(decimalCount);
    if (decimalValue > 0) {
      return (result + decimalValue.slice(1)).replace(".", ",");
    }
  }

  return result;
}

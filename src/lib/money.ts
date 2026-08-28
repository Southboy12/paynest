const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export function formatNaira(kobo: number): string {
  return nairaFormatter.format(kobo / 100);
}

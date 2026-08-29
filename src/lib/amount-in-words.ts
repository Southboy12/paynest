const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function belowThousand(n: number): string {
  let out = "";
  const hundreds = Math.floor(n / 100);
  if (hundreds > 0) {
    out += `${ONES[hundreds]} Hundred`;
  }
  const rest = n % 100;
  if (rest > 0) {
    if (out) out += " and ";
    if (rest < 20) {
      out += ONES[rest];
    } else {
      const tens = Math.floor(rest / 10);
      const ones = rest % 10;
      out += TENS[tens];
      if (ones > 0) out += `-${ONES[ones]}`;
    }
  }
  return out;
}

function toWords(n: number): string {
  if (n === 0) return "Zero";
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const remainder = n % 1_000;
  if (millions > 0) parts.push(`${belowThousand(millions)} Million`);
  if (thousands > 0) parts.push(`${belowThousand(thousands)} Thousand`);
  if (remainder > 0) parts.push(belowThousand(remainder));
  return parts.join(" ");
}

export function nairaInWords(kobo: number): string {
  const naira = Math.floor(kobo / 100);
  return `${toWords(naira)} Naira Only`;
}

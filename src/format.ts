const currency = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "RD$ 2,347.00" — Intl devuelve "RD$2,347.00"; el diseño separa el símbolo con un espacio. */
export function formatCurrency(amount: number): string {
  return currency
    .formatToParts(amount)
    .map((part) => (part.type === 'currency' ? `${part.value.trim()} ` : part.value))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

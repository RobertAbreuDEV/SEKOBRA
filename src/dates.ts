import type { Subscription } from './types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Fecha de cobro en un mes dado; el día se ajusta al último del mes (31 → 28/29 en febrero). */
function chargeDateIn(year: number, month: number, billingDay: number): Date {
  // new Date normaliza meses fuera de rango (p. ej. 12 → enero del año siguiente).
  const normalized = new Date(year, month, 1);
  const y = normalized.getFullYear();
  const m = normalized.getMonth();
  return new Date(y, m, Math.min(billingDay, daysInMonth(y, m)));
}

type ChargeSchedule = Pick<Subscription, 'cycle' | 'billingDay' | 'billingMonth'>;

/** Próximo cobro en o después de `from` (un cobro de hoy cuenta como próximo). */
export function nextChargeDate(sub: ChargeSchedule, from: Date = new Date()): Date {
  const today = startOfDay(from);
  const year = today.getFullYear();

  if (sub.cycle === 'yearly') {
    const month = sub.billingMonth ?? 0;
    const thisYear = chargeDateIn(year, month, sub.billingDay);
    return thisYear >= today ? thisYear : chargeDateIn(year + 1, month, sub.billingDay);
  }

  const thisMonth = chargeDateIn(year, today.getMonth(), sub.billingDay);
  return thisMonth >= today ? thisMonth : chargeDateIn(year, today.getMonth() + 1, sub.billingDay);
}

/** Días de calendario entre `from` y `date` (0 = hoy). Inmune a cambios de horario. */
export function daysUntil(date: Date, from: Date = new Date()): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}

export function monthlyCost(sub: Pick<Subscription, 'cycle' | 'price'>): number {
  return sub.cycle === 'yearly' ? sub.price / 12 : sub.price;
}

export function monthlyTotal(subs: ReadonlyArray<Pick<Subscription, 'cycle' | 'price'>>): number {
  return subs.reduce((total, sub) => total + monthlyCost(sub), 0);
}

/** "6 nov. 2025" */
export function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}. ${date.getFullYear()}`;
}

/** "Hoy, 3 nov" para hoy; si no, `formatDate`. */
export function formatChargeDate(date: Date, from: Date = new Date()): string {
  if (daysUntil(date, from) === 0) return `Hoy, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
  return formatDate(date);
}

/** "hoy" · "mañana" · "en 3 días" */
export function formatDaysUntil(days: number): string {
  if (days === 0) return 'hoy';
  if (days === 1) return 'mañana';
  return `en ${days} días`;
}

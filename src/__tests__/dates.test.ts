import { daysUntil, monthlyCost, monthlyTotal, nextChargeDate } from '../dates';

const d = (year: number, month: number, day: number) => new Date(year, month - 1, day);
const ymd = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()];

describe('nextChargeDate', () => {
  describe('día 31 en febrero', () => {
    it('se ajusta al 28 en año no bisiesto', () => {
      expect(ymd(nextChargeDate({ cycle: 'monthly', billingDay: 31 }, d(2025, 2, 10)))).toEqual([2025, 2, 28]);
    });

    it('se ajusta al 29 en año bisiesto', () => {
      expect(ymd(nextChargeDate({ cycle: 'monthly', billingDay: 31 }, d(2024, 2, 10)))).toEqual([2024, 2, 29]);
    });

    it('vuelve al 31 en marzo después de cobrar el 28 de febrero', () => {
      expect(ymd(nextChargeDate({ cycle: 'monthly', billingDay: 31 }, d(2025, 3, 1)))).toEqual([2025, 3, 31]);
    });

    it('anual el 31 de febrero cae el último día de febrero', () => {
      const sub = { cycle: 'yearly' as const, billingDay: 31, billingMonth: 1 };
      expect(ymd(nextChargeDate(sub, d(2025, 1, 15)))).toEqual([2025, 2, 28]);
      expect(ymd(nextChargeDate(sub, d(2027, 3, 1)))).toEqual([2028, 2, 29]);
    });
  });

  describe('cobro de hoy vs. ya pasado', () => {
    it('si el cobro es hoy, la próxima fecha es hoy', () => {
      expect(ymd(nextChargeDate({ cycle: 'monthly', billingDay: 15 }, new Date(2025, 5, 15, 23, 59)))).toEqual([2025, 6, 15]);
    });

    it('si el cobro ya pasó este mes, pasa al mes siguiente', () => {
      expect(ymd(nextChargeDate({ cycle: 'monthly', billingDay: 15 }, d(2025, 6, 16)))).toEqual([2025, 7, 15]);
    });

    it('si ya pasó en diciembre, pasa a enero del año siguiente', () => {
      expect(ymd(nextChargeDate({ cycle: 'monthly', billingDay: 5 }, d(2025, 12, 20)))).toEqual([2026, 1, 5]);
    });

    it('anual: hoy cuenta; ya pasado pasa al año siguiente', () => {
      const sub = { cycle: 'yearly' as const, billingDay: 10, billingMonth: 2 };
      expect(ymd(nextChargeDate(sub, d(2025, 3, 10)))).toEqual([2025, 3, 10]);
      expect(ymd(nextChargeDate(sub, d(2025, 3, 11)))).toEqual([2026, 3, 10]);
    });
  });
});

describe('monthlyCost / monthlyTotal', () => {
  it('un plan anual cuesta precio / 12 al mes', () => {
    expect(monthlyCost({ cycle: 'yearly', price: 1200 })).toBe(100);
    expect(monthlyCost({ cycle: 'yearly', price: 599 })).toBeCloseTo(49.9167, 4);
  });

  it('un plan mensual cuesta su precio', () => {
    expect(monthlyCost({ cycle: 'monthly', price: 599 })).toBe(599);
  });

  it('el total suma mensuales y anuales/12', () => {
    expect(monthlyTotal([
      { cycle: 'monthly', price: 599 },
      { cycle: 'yearly', price: 1200 },
      { cycle: 'monthly', price: 299 },
    ])).toBe(998);
    expect(monthlyTotal([])).toBe(0);
  });
});

describe('daysUntil', () => {
  it('es 0 para hoy sin importar la hora', () => {
    expect(daysUntil(new Date(2025, 10, 3, 0, 1), new Date(2025, 10, 3, 23, 59))).toBe(0);
  });

  it('cuenta días de calendario, no bloques de 24 h', () => {
    expect(daysUntil(new Date(2025, 10, 4, 0, 30), new Date(2025, 10, 3, 23, 30))).toBe(1);
  });

  it('cruza meses y años', () => {
    expect(daysUntil(d(2025, 12, 1), d(2025, 11, 3))).toBe(28);
    expect(daysUntil(d(2026, 1, 1), d(2025, 12, 31))).toBe(1);
  });

  it('cruza el cambio de horario sin desfasarse', () => {
    expect(daysUntil(d(2025, 3, 10), d(2025, 3, 8))).toBe(2);
    expect(daysUntil(d(2025, 11, 3), d(2025, 11, 1))).toBe(2);
  });

  it('es negativo para fechas pasadas', () => {
    expect(daysUntil(d(2025, 11, 1), d(2025, 11, 3))).toBe(-2);
  });
});

export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  cycle: BillingCycle;
  /** Día del mes (1–31). Si el mes tiene menos días se cobra el último día. */
  billingDay: number;
  /** Mes de cobro (0 = enero … 11 = diciembre). Solo aplica a ciclo anual. */
  billingMonth?: number;
  remindDaysBefore: number;
  notificationId?: string;
}

/** Datos que el usuario edita en el formulario. */
export type SubscriptionInput = Omit<Subscription, 'id' | 'notificationId'>;

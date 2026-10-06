import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { nextChargeDate } from '../dates';
import { cancelReminder, scheduleReminder, setupNotifications } from '../notifications';
import { loadSubscriptions, saveSubscriptions } from '../storage';
import type { Subscription, SubscriptionInput } from '../types';

function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function animateNextLayout(): void {
  LayoutAnimation.configureNext({
    duration: 220,
    create: { type: 'easeInEaseOut', property: 'opacity' },
    update: { type: 'easeInEaseOut' },
    delete: { type: 'easeInEaseOut', property: 'opacity' },
  });
}

/** Cancela el aviso previo y programa uno nuevo para la suscripción. */
async function reschedule(sub: Subscription): Promise<Subscription> {
  await cancelReminder(sub.notificationId);
  const notificationId = await scheduleReminder(sub);
  return { ...sub, notificationId };
}

export interface UseSubscriptions {
  /** Ordenadas por próxima fecha de cobro. */
  subs: Subscription[];
  loading: boolean;
  add: (input: SubscriptionInput) => Promise<Subscription>;
  update: (id: string, input: SubscriptionInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useSubscriptions(): UseSubscriptions {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsRef = useRef<Subscription[]>([]);

  const commit = useCallback(async (next: Subscription[], animate = false) => {
    if (animate) animateNextLayout();
    itemsRef.current = next;
    setItems(next);
    await saveSubscriptions(next);
  }, []);

  // Al abrir la app: cargar y re-programar todas las notificaciones.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await setupNotifications();
      const stored = await loadSubscriptions();
      const rescheduled = await Promise.all(stored.map(reschedule));
      if (cancelled) return;
      await commit(rescheduled);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [commit]);

  const add = useCallback(
    async (input: SubscriptionInput) => {
      const sub = await reschedule({ ...input, id: createId() });
      await commit([...itemsRef.current, sub], true);
      return sub;
    },
    [commit],
  );

  const update = useCallback(
    async (id: string, input: SubscriptionInput) => {
      const current = itemsRef.current.find((s) => s.id === id);
      if (!current) return;
      const updated = await reschedule({ ...current, ...input });
      await commit(
        itemsRef.current.map((s) => (s.id === id ? updated : s)),
        true,
      );
    },
    [commit],
  );

  const remove = useCallback(
    async (id: string) => {
      const current = itemsRef.current.find((s) => s.id === id);
      await cancelReminder(current?.notificationId);
      await commit(
        itemsRef.current.filter((s) => s.id !== id),
        true,
      );
    },
    [commit],
  );

  const subs = useMemo(() => {
    const now = new Date();
    return items
      .map((sub) => ({ sub, next: nextChargeDate(sub, now).getTime() }))
      .sort((a, b) => a.next - b.next || a.sub.name.localeCompare(b.sub.name))
      .map(({ sub }) => sub);
  }, [items]);

  return { subs, loading, add, update, remove };
}

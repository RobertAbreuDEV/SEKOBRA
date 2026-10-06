import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Subscription } from './types';

const STORAGE_KEY = '@sekobra/subscriptions';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSubscription(value: unknown): value is Subscription {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    (value.cycle === 'monthly' || value.cycle === 'yearly') &&
    typeof value.billingDay === 'number' &&
    (value.billingMonth === undefined || typeof value.billingMonth === 'number') &&
    typeof value.remindDaysBefore === 'number' &&
    (value.notificationId === undefined || typeof value.notificationId === 'string')
  );
}

export async function loadSubscriptions(): Promise<Subscription[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSubscription) : [];
  } catch {
    return [];
  }
}

export async function saveSubscriptions(subs: Subscription[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { daysUntil, formatDaysUntil, nextChargeDate } from './dates';
import { formatCurrency } from './format';
import type { Subscription } from './types';

const CHANNEL_ID = 'reminders';
const REMINDER_HOUR = 9;

export interface ReminderData extends Record<string, unknown> {
  subscriptionId: string;
}

export async function setupNotifications(): Promise<boolean> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Recordatorios de cobro',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#FC1C3C',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/** Fecha del aviso: N días antes del próximo cobro a las 9:00. Si ya pasó, usa el cobro siguiente. */
function reminderDate(sub: Subscription, now: Date): Date {
  let charge = nextChargeDate(sub, now);
  for (let i = 0; i < 2; i++) {
    const trigger = new Date(charge);
    trigger.setDate(trigger.getDate() - sub.remindDaysBefore);
    trigger.setHours(REMINDER_HOUR, 0, 0, 0);
    if (trigger > now) return trigger;
    const dayAfter = new Date(charge);
    dayAfter.setDate(dayAfter.getDate() + 1);
    charge = nextChargeDate(sub, dayAfter);
  }
  return charge;
}

function reminderBody(sub: Subscription, trigger: Date): string {
  const days = daysUntil(nextChargeDate(sub, trigger), trigger);
  return `Se cobran ${formatCurrency(sub.price)} ${formatDaysUntil(days)}.`;
}

export async function scheduleReminder(sub: Subscription): Promise<string | undefined> {
  try {
    const trigger = reminderDate(sub, new Date());
    const data: ReminderData = { subscriptionId: sub.id };
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `Cobro de ${sub.name} pronto`,
        body: reminderBody(sub, trigger),
        data,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
        channelId: CHANNEL_ID,
      },
    });
  } catch {
    return undefined;
  }
}

export async function cancelReminder(notificationId?: string): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // La notificación ya no existe; no hay nada que cancelar.
  }
}

export function getSubscriptionId(response: Notifications.NotificationResponse): string | undefined {
  const id = response.notification.request.content.data?.subscriptionId;
  return typeof id === 'string' ? id : undefined;
}

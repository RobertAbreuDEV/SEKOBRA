import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { TabBar, type TabKey } from './src/components/TabBar';
import { useSubscriptions } from './src/hooks/useSubscriptions';
import { getSubscriptionId } from './src/notifications';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { SubscriptionDetailSheet } from './src/screens/SubscriptionDetailSheet';
import { SubscriptionFormScreen, type FormMode } from './src/screens/SubscriptionFormScreen';
import { colors } from './src/theme';
import type { Subscription, SubscriptionInput } from './src/types';

// El splash nativo se mantiene hasta que AnimatedSplash toma el relevo.
SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 150, fade: true });

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Root />
    </SafeAreaProvider>
  );
}

function Root() {
  const { subs, loading, add, update, remove } = useSubscriptions();
  const [tab, setTab] = useState<TabKey>('home');
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [pendingNotificationId, setPendingNotificationId] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  // Al tocar una notificación (app abierta, en segundo plano o cerrada) abrir el detalle.
  useEffect(() => {
    const last = Notifications.getLastNotificationResponse();
    const initialId = last ? getSubscriptionId(last) : undefined;
    if (initialId) setPendingNotificationId(initialId);

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const id = getSubscriptionId(response);
      if (id) setPendingNotificationId(id);
    });
    return () => subscription.remove();
  }, []);

  // Esperar a que carguen las suscripciones y termine el splash antes de abrir el detalle.
  useEffect(() => {
    if (loading || showSplash || !pendingNotificationId) return;
    if (subs.some((s) => s.id === pendingNotificationId)) {
      setTab('home');
      setFormMode(null);
      setDetailId(pendingNotificationId);
    }
    setPendingNotificationId(null);
    Notifications.clearLastNotificationResponse();
  }, [loading, showSplash, pendingNotificationId, subs]);

  const detailSub = subs.find((s) => s.id === detailId);

  const confirmDelete = useCallback(
    (sub: Subscription) => {
      Alert.alert('Eliminar suscripción', `¿Seguro que quieres eliminar ${sub.name}? Se cancelará su recordatorio.`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setDetailId(null);
            setFormMode(null);
            void remove(sub.id);
          },
        },
      ]);
    },
    [remove],
  );

  const handleSubmit = useCallback(
    (input: SubscriptionInput) => {
      const mode = formMode;
      setFormMode(null);
      if (mode?.kind === 'edit') void update(mode.sub.id, input);
      else void add(input);
    },
    [formMode, add, update],
  );

  const openCreate = useCallback(() => setFormMode({ kind: 'create' }), []);
  const openDetail = useCallback((sub: Subscription) => setDetailId(sub.id), []);
  const openEdit = useCallback((sub: Subscription) => {
    setDetailId(null);
    setFormMode({ kind: 'edit', sub });
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          {tab === 'home' && (
            <HomeScreen subs={subs} loading={loading} onAdd={openCreate} onOpen={openDetail} onMenu={() => setTab('more')} />
          )}
          {tab === 'history' && <PlaceholderScreen icon="time-outline" title="Historial" />}
          {tab === 'more' && <PlaceholderScreen icon="menu-outline" title="Más" />}
        </View>
        <TabBar active={tab} onChange={setTab} />

        <SubscriptionDetailSheet sub={detailSub} onClose={() => setDetailId(null)} onEdit={openEdit} onDelete={confirmDelete} />
        <SubscriptionFormScreen mode={formMode} onClose={() => setFormMode(null)} onSubmit={handleSubmit} onDelete={confirmDelete} />
      </SafeAreaView>
      {showSplash && <AnimatedSplash ready={!loading} onFinish={hideSplash} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
});

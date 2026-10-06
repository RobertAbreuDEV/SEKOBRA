import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { SegmentedControl } from '../components/SegmentedControl';
import { SelectField } from '../components/SelectField';
import { Stepper } from '../components/Stepper';
import { TextField } from '../components/TextField';
import { MONTH_NAMES } from '../dates';
import { useResponsive } from '../hooks/useResponsive';
import { colors, radius, spacing, typography } from '../theme';
import type { BillingCycle, Subscription, SubscriptionInput } from '../types';

export type FormMode = { kind: 'create' } | { kind: 'edit'; sub: Subscription };

interface Props {
  mode: FormMode | null;
  onClose: () => void;
  onSubmit: (input: SubscriptionInput) => void;
  onDelete: (sub: Subscription) => void;
}

interface FormState {
  name: string;
  price: string;
  cycle: BillingCycle;
  billingDay: number;
  billingMonth: number;
  remindDaysBefore: number;
}

type FormErrors = Partial<Record<'name' | 'price', string>>;

const MAX_REMIND_DAYS = 30;
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
const MONTH_OPTIONS = MONTH_NAMES.map((label, value) => ({ value, label }));
const CYCLE_OPTIONS = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
] as const;

function initialState(mode: FormMode | null): FormState {
  if (mode?.kind === 'edit') {
    const { sub } = mode;
    return {
      name: sub.name,
      price: sub.price.toFixed(2),
      cycle: sub.cycle,
      billingDay: sub.billingDay,
      billingMonth: sub.billingMonth ?? 0,
      remindDaysBefore: sub.remindDaysBefore,
    };
  }
  return { name: '', price: '', cycle: 'monthly', billingDay: 1, billingMonth: 0, remindDaysBefore: 3 };
}

function parsePrice(raw: string): number {
  return Number(raw.replace(/[^\d.,]/g, '').replace(',', '.'));
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Escribe el nombre del servicio.';
  const price = parsePrice(form.price);
  if (!form.price.trim()) errors.price = 'Escribe el precio.';
  else if (!Number.isFinite(price) || price <= 0) errors.price = 'El precio debe ser un número mayor que 0.';
  return errors;
}

export function SubscriptionFormScreen({ mode, onClose, onSubmit, onDelete }: Props) {
  const [form, setForm] = useState<FormState>(() => initialState(mode));
  const [errors, setErrors] = useState<FormErrors>({});
  const { isTablet, dialogMaxWidth } = useResponsive();

  // Reiniciar al abrir el formulario (nuevo o editar otra suscripción).
  useEffect(() => {
    if (mode) {
      setForm(initialState(mode));
      setErrors({});
    }
  }, [mode]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'name' || key === 'price') setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = () => {
    const found = validate(form);
    setErrors(found);
    if (found.name || found.price) return;
    onSubmit({
      name: form.name.trim(),
      price: Math.round(parsePrice(form.price) * 100) / 100,
      cycle: form.cycle,
      billingDay: form.billingDay,
      billingMonth: form.cycle === 'yearly' ? form.billingMonth : undefined,
      remindDaysBefore: form.remindDaysBefore,
    });
  };

  const isYearly = form.cycle === 'yearly';

  const content = (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.titleBar}>
        <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Cerrar">
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{mode?.kind === 'edit' ? 'Editar suscripción' : 'Nueva suscripción'}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.fields} keyboardShouldPersistTaps="handled">
        <TextField
          label="Nombre"
          placeholder="Ej. Netflix"
          value={form.name}
          onChangeText={(v) => set('name', v)}
          error={errors.name}
          returnKeyType="next"
        />
        <TextField
          label="Precio (RD$)"
          placeholder="Ej. 599.00"
          keyboardType="decimal-pad"
          value={form.price}
          onChangeText={(v) => set('price', v)}
          error={errors.price}
        />
        <View style={styles.group}>
          <Text style={styles.label}>Ciclo</Text>
          <SegmentedControl options={CYCLE_OPTIONS} value={form.cycle} onChange={(v) => set('cycle', v)} />
        </View>
        <SelectField label="Día de cobro" value={form.billingDay} options={DAY_OPTIONS} onChange={(v) => set('billingDay', v)} />
        <SelectField
          label="Mes de cobro (solo anual)"
          value={form.billingMonth}
          options={MONTH_OPTIONS}
          onChange={(v) => set('billingMonth', v)}
          disabled={!isYearly}
        />
        <View style={styles.group}>
          <Text style={styles.label}>Avisar con X días de anticipación</Text>
          <Stepper
            value={form.remindDaysBefore}
            min={0}
            max={MAX_REMIND_DAYS}
            onChange={(v) => set('remindDaysBefore', v)}
            accessibilityLabel="Días de anticipación del aviso"
          />
        </View>

        {mode?.kind === 'edit' && (
          <Pressable style={styles.delete} onPress={() => onDelete(mode.sub)} accessibilityRole="button" hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={colors.accent} />
            <Text style={styles.deleteLabel}>Eliminar suscripción</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Cancelar" variant="outline" onPress={onClose} style={styles.footerButton} />
        <Button label="Guardar" onPress={handleSave} style={styles.footerButton} />
      </View>
    </KeyboardAvoidingView>
  );

  if (isTablet) {
    return (
      <Modal visible={mode !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={[styles.dialog, { maxWidth: dialogMaxWidth }]}>{content}</View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={mode !== null} animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <SafeAreaView style={styles.screen}>{content}</SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  dialog: {
    width: '100%',
    height: '90%',
    maxHeight: 760,
    backgroundColor: colors.background,
    borderRadius: radius.lg + 6,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: 'hidden',
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: typography.title,
  fields: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.xl },
  group: { gap: spacing.sm },
  label: typography.label,
  delete: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.sm, paddingTop: spacing.sm },
  deleteLabel: { color: colors.accent, fontSize: 15, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  footerButton: { flex: 1 },
});

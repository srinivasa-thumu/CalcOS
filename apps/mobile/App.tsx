import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  calculateDuration,
  calculateSimpleInterest,
} from '@calcos/calculation-core';
import { calculateCompoundInterest } from '@calcos/calculation-core';
import { validateCompoundInterestInput } from '@calcos/validation';
import type { CompoundingFrequency } from '@calcos/domain-types';
import type {
  DurationMode,
  InterestRateMode,
} from '@calcos/domain-types';
import { validateSimpleInterestInput } from '@calcos/validation';
import { saveCalculationHistoryEntry,getCalculationHistory,
  deleteCalculationHistoryEntry,
  clearCalculationHistory,
 } from './src/storage/calculationHistoryStorage';

import type { CalculationHistoryEntry } from './src/history/history.types';

const COLORS = {
  background: '#F6F8FC',
  surface: '#FFFFFF',
  primary: '#2457D6',
  primaryLight: '#E9EFFF',
  text: '#17233B',
  secondaryText: '#667085',
  border: '#E4E9F2',
  error: '#C62828',
  success: '#16845B',
};

type FormErrors = {
  principal?: string;
  annualRate?: string;
  monthlyRatePer100?: string;
  duration?: string;
};

type CompoundFormErrors = FormErrors & {
  compoundingFrequency?: string;
};

type CalculationResult = {
  interest: number;
  totalAmount: number;
  annualRateEquivalent?: number;
  durationLabel?: string;
};

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function parseNumber(value: string): number {
  return value.trim() === '' ? Number.NaN : Number(value);
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
  decimal?: boolean;
};

function Field({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  decimal = false,
}: FieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Enter value'}
        placeholderTextColor="#98A2B3"
        keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
        style={[styles.input, error ? styles.inputError : undefined]}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

type ChoiceProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function Choice({ label, selected, onPress }: ChoiceProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceSelected]}
    >
      <Text
        style={[
          styles.choiceText,
          selected && styles.choiceTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.primaryButton}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function SecondaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.secondaryButton}
    >
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function SimpleInterestScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [principal, setPrincipal] = useState('');
  const [rateMode, setRateMode] =
    useState<InterestRateMode>('annual');
  const [annualRate, setAnnualRate] = useState('');
  const [monthlyRatePer100, setMonthlyRatePer100] = useState('');

  const [durationMode, setDurationMode] =
    useState<DurationMode>('manual');
  const [durationYears, setDurationYears] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] =
    useState<CalculationResult | null>(null);

  function resetResult() {
    setResult(null);
  }

  function handleReset() {
    Keyboard.dismiss();
    setPrincipal('');
    setRateMode('annual');
    setAnnualRate('');
    setMonthlyRatePer100('');
    setDurationMode('manual');
    setDurationYears('');
    setDurationMonths('');
    setDurationDays('');
    setStartDate('');
    setEndDate('');
    setErrors({});
    setResult(null);
  }

  function handleCalculate() {
    Keyboard.dismiss();
    setResult(null);

    const rate =
      rateMode === 'annual'
        ? parseNumber(annualRate)
        : parseNumber(monthlyRatePer100);

    const baseInput = {
      principal: parseNumber(principal),
      annualRate: rateMode === 'annual' ? rate : rate * 12,
      monthlyRatePer100:
        rateMode === 'monthly-per-100' ? rate : undefined,
      rateMode,
      durationMode,
      timeInYears: Number.NaN,
      ...(durationMode === 'date-range'
        ? {
            startDate,
            endDate,
            dayCountConvention: 'actual/365' as const,
          }
        : {
            durationYears: parseNumber(durationYears),
            durationMonths: parseNumber(durationMonths),
            durationDays: parseNumber(durationDays),
          }),
    };

    let duration:
      | ReturnType<typeof calculateDuration>
      | undefined;
    let durationError: string | undefined;

    try {
      duration = calculateDuration(
        durationMode === 'date-range'
          ? {
              durationMode,
              startDate,
              endDate,
              dayCountConvention: 'actual/365',
            }
          : {
              durationMode,
              durationYears: parseNumber(durationYears),
              durationMonths: parseNumber(durationMonths),
              durationDays: parseNumber(durationDays),
            },
      );
    } catch (error) {
      durationError =
        error instanceof Error
          ? error.message
          : 'Enter a valid duration.';
    }

    const validation = validateSimpleInterestInput({
      ...baseInput,
      ...(duration ?? {}),
      timeInYears: duration?.timeInYears ?? Number.NaN,
    });

    const nextErrors: FormErrors = {
      ...(validation.errors.principal
        ? { principal: validation.errors.principal }
        : {}),
      ...(validation.errors.annualRate
        ? { annualRate: validation.errors.annualRate }
        : {}),
      ...(validation.errors.monthlyRatePer100
        ? { monthlyRatePer100: validation.errors.monthlyRatePer100 }
        : {}),
      ...(durationError
        ? { duration: durationError }
        : !duration || duration.timeInYears <= 0
          ? {
              duration:
                validation.errors.timeInYears ??
                'Time period must be greater than 0.',
            }
          : {}),
    };

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0 ||
      !duration ||
      !validation.isValid
    ) {
      return;
    }

    const calculation = calculateSimpleInterest({
      ...baseInput,
      ...duration,
      durationMode,
      ...(durationMode === 'date-range'
        ? {
            startDate,
            endDate,
            dayCountConvention: 'actual/365' as const,
          }
        : {
            durationYears: parseNumber(durationYears),
            durationMonths: parseNumber(durationMonths),
            durationDays: parseNumber(durationDays),
          }),
    });

    setResult(calculation);

    const historyEntry: CalculationHistoryEntry = {
      id: `${Date.now()}-simple`,
      type: 'simple-interest',
      createdAt: new Date().toISOString(),
      principal: baseInput.principal,
      interest: calculation.interest,
      totalAmount: calculation.totalAmount,
      rateMode,
      annualRate: baseInput.annualRate,
      ...(rateMode === 'monthly-per-100'
        ? { monthlyRatePer100: rate }
        : {}),
      durationLabel: calculation.durationLabel ?? '',
      durationMode,
    };

    void saveCalculationHistoryEntry(historyEntry).catch((error) => {
      console.error('Failed to save simple interest history:', error);
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.screenContainer}
        >
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹  Home</Text>
          </Pressable>

          <Text style={styles.screenTitle}>Simple Interest</Text>
          <Text style={styles.screenDescription}>
            Calculate interest on your principal amount.
          </Text>

          <View style={styles.card}>
            <Field
              label="Principal Amount (₹)"
              value={principal}
              onChangeText={(value) => {
                setPrincipal(value);
                setErrors((current) => ({
                  ...current,
                  principal: undefined,
                }));
                resetResult();
              }}
              error={errors.principal}
              decimal
            />

            <Text style={styles.sectionLabel}>Interest Rate Type</Text>

            <View
              accessibilityRole="radiogroup"
              style={styles.choiceGroup}
            >
              <Choice
                label="Annual rate (%)"
                selected={rateMode === 'annual'}
                onPress={() => {
                  setRateMode('annual');
                  setErrors({});
                  resetResult();
                }}
              />

              <Choice
                label="Monthly per ₹100"
                selected={rateMode === 'monthly-per-100'}
                onPress={() => {
                  setRateMode('monthly-per-100');
                  setErrors({});
                  resetResult();
                }}
              />
            </View>

            {rateMode === 'annual' ? (
              <Field
                label="Annual Interest Rate (%)"
                value={annualRate}
                onChangeText={(value) => {
                  setAnnualRate(value);
                  setErrors((current) => ({
                    ...current,
                    annualRate: undefined,
                  }));
                  resetResult();
                }}
                error={errors.annualRate}
                decimal
              />
            ) : (
              <Field
                label="Monthly Interest per ₹100 (₹)"
                value={monthlyRatePer100}
                onChangeText={(value) => {
                  setMonthlyRatePer100(value);
                  setErrors((current) => ({
                    ...current,
                    monthlyRatePer100: undefined,
                  }));
                  resetResult();
                }}
                error={errors.monthlyRatePer100}
                decimal
              />
            )}

            <Text style={styles.sectionLabel}>Duration Type</Text>

            <View style={styles.choiceGroup}>
              <Choice
                label="Manual"
                selected={durationMode === 'manual'}
                onPress={() => {
                  setDurationMode('manual');
                  setErrors({});
                  resetResult();
                }}
              />

              <Choice
                label="Date range"
                selected={durationMode === 'date-range'}
                onPress={() => {
                  setDurationMode('date-range');
                  setErrors({});
                  resetResult();
                }}
              />
            </View>

            {durationMode === 'manual' ? (
              <>
                <Field
                  label="Years"
                  value={durationYears}
                  onChangeText={(value) => {
                    setDurationYears(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />

                <Field
                  label="Months (0–11)"
                  value={durationMonths}
                  onChangeText={(value) => {
                    setDurationMonths(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />

                <Field
                  label="Days"
                  value={durationDays}
                  onChangeText={(value) => {
                    setDurationDays(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />
              </>
            ) : (
              <>
                <Field
                  label="Start Date (YYYY-MM-DD)"
                  value={startDate}
                  placeholder="2024-01-01"
                  onChangeText={(value) => {
                    setStartDate(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />

                <Field
                  label="End Date (YYYY-MM-DD)"
                  value={endDate}
                  placeholder="2026-05-03"
                  onChangeText={(value) => {
                    setEndDate(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />

                <Text style={styles.helperText}>
                  Date-based calculations use Actual/365.
                </Text>
              </>
            )}

            {errors.duration ? (
              <Text accessibilityRole="alert" style={styles.errorText}>
                {errors.duration}
              </Text>
            ) : null}

            <PrimaryButton
              title="Calculate Interest"
              onPress={handleCalculate}
            />

            <SecondaryButton
              title="Reset"
              onPress={handleReset}
            />
          </View>

          {result ? (
            <View
              accessibilityLabel="Calculation result"
              style={styles.resultCard}
            >
              <Text style={styles.resultHeading}>Your Results</Text>

              <Text style={styles.resultLabel}>Simple Interest</Text>
              <Text style={styles.resultAmount}>
                {formatCurrency(result.interest)}
              </Text>

              <View style={styles.separator} />

              <Text style={styles.resultLabel}>Total Amount</Text>
              <Text style={styles.resultTotal}>
                {formatCurrency(result.totalAmount)}
              </Text>

              {result.durationLabel ? (
                <View style={styles.resultDetail}>
                  <Text style={styles.resultLabel}>Duration</Text>
                  <Text style={styles.resultDetailValue}>
                    {result.durationLabel}
                  </Text>
                </View>
              ) : null}

              {result.annualRateEquivalent !== undefined ? (
                <View style={styles.resultDetail}>
                  <Text style={styles.resultLabel}>
                    Nominal Annual Rate Equivalent
                  </Text>
                  <Text style={styles.resultDetailValue}>
                    {result.annualRateEquivalent.toLocaleString('en-IN', {
                      maximumFractionDigits: 6,
                    })}
                    %
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


function CompoundInterestScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [principal, setPrincipal] = useState('');
  const [rateMode, setRateMode] =
    useState<InterestRateMode>('annual');
  const [annualRate, setAnnualRate] = useState('');
  const [monthlyRatePer100, setMonthlyRatePer100] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>('annually');

  const [durationMode, setDurationMode] =
    useState<DurationMode>('manual');
  const [durationYears, setDurationYears] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [errors, setErrors] = useState<CompoundFormErrors>({});
  const [result, setResult] =
    useState<CalculationResult | null>(null);

  const frequencies: {
    label: string;
    value: CompoundingFrequency;
  }[] = [
    { label: 'Annually', value: 'annually' },
    { label: 'Half-yearly', value: 'semi-annually' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Daily', value: 'daily' },
  ];

  function resetResult() {
    setResult(null);
  }

  function handleReset() {
    Keyboard.dismiss();
    setPrincipal('');
    setRateMode('annual');
    setAnnualRate('');
    setMonthlyRatePer100('');
    setCompoundingFrequency('annually');
    setDurationMode('manual');
    setDurationYears('');
    setDurationMonths('');
    setDurationDays('');
    setStartDate('');
    setEndDate('');
    setErrors({});
    setResult(null);
  }

  function handleCalculate() {
    Keyboard.dismiss();
    setResult(null);

    const rate =
      rateMode === 'annual'
        ? Number(annualRate)
        : Number(monthlyRatePer100);

    const baseInput = {
      principal: Number(principal),
      annualRate: rateMode === 'annual' ? rate : rate * 12,
      monthlyRatePer100:
        rateMode === 'monthly-per-100' ? rate : undefined,
      rateMode,
      compoundingFrequency,
      durationMode,
      timeInYears: Number.NaN,
    };

    let duration:
      | ReturnType<typeof calculateDuration>
      | undefined;
    let durationError: string | undefined;

    try {
      duration = calculateDuration(
        durationMode === 'date-range'
          ? {
              durationMode,
              startDate,
              endDate,
              dayCountConvention: 'actual/365',
            }
          : {
              durationMode,
              durationYears: Number(durationYears),
              durationMonths: Number(durationMonths),
              durationDays: Number(durationDays),
            },
      );
    } catch (error) {
      durationError =
        error instanceof Error
          ? error.message
          : 'Enter a valid duration.';
    }

    const validation = validateCompoundInterestInput({
      ...baseInput,
      ...(duration ?? {}),
      timeInYears: duration?.timeInYears ?? Number.NaN,
    });

    const nextErrors: CompoundFormErrors = {
      ...(validation.errors.principal
        ? { principal: validation.errors.principal }
        : {}),
      ...(validation.errors.annualRate
        ? { annualRate: validation.errors.annualRate }
        : {}),
      ...(validation.errors.monthlyRatePer100
        ? {
            monthlyRatePer100:
              validation.errors.monthlyRatePer100,
          }
        : {}),
      ...(validation.errors.compoundingFrequency
        ? {
            compoundingFrequency:
              validation.errors.compoundingFrequency,
          }
        : {}),
      ...(durationError
        ? { duration: durationError }
        : !duration || duration.timeInYears <= 0
          ? {
              duration:
                validation.errors.timeInYears ??
                'Time period must be greater than 0.',
            }
          : {}),
    };

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0 ||
      !duration ||
      !validation.isValid
    ) {
      return;
    }

    const calculation = calculateCompoundInterest({
      ...baseInput,
      ...duration,
      durationMode,
      ...(durationMode === 'date-range'
        ? {
            startDate,
            endDate,
            dayCountConvention: 'actual/365' as const,
          }
        : {
            durationYears: Number(durationYears),
            durationMonths: Number(durationMonths),
            durationDays: Number(durationDays),
          }),
    });

    setResult(calculation);

    const historyEntry: CalculationHistoryEntry = {
      id: `${Date.now()}-compound`,
      type: 'compound-interest',
      createdAt: new Date().toISOString(),
      principal: baseInput.principal,
      interest: calculation.interest,
      totalAmount: calculation.totalAmount,
      rateMode,
      annualRate: baseInput.annualRate,
      ...(rateMode === 'monthly-per-100'
        ? { monthlyRatePer100: rate }
        : {}),
      durationLabel: calculation.durationLabel ?? '',
      durationMode,
      compoundingFrequency,
    };

    void saveCalculationHistoryEntry(historyEntry).catch((error) => {
      console.error('Failed to save compound interest history:', error);
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.screenContainer}
        >
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹ Home</Text>
          </Pressable>

          <Text style={styles.screenTitle}>Compound Interest</Text>
          <Text style={styles.screenDescription}>
            See how your money grows when interest earns interest.
          </Text>

          <View style={styles.card}>
            <Field
              label="Principal Amount (₹)"
              value={principal}
              onChangeText={(value) => {
                setPrincipal(value);
                setErrors((current) => ({
                  ...current,
                  principal: undefined,
                }));
                resetResult();
              }}
              error={errors.principal}
              decimal
            />

            <Text style={styles.sectionLabel}>Interest Rate Type</Text>
            <View style={styles.choiceGroup}>
              <Choice
                label="Annual rate (%)"
                selected={rateMode === 'annual'}
                onPress={() => {
                  setRateMode('annual');
                  setErrors({});
                  resetResult();
                }}
              />
              <Choice
                label="Monthly per ₹100"
                selected={rateMode === 'monthly-per-100'}
                onPress={() => {
                  setRateMode('monthly-per-100');
                  setErrors({});
                  resetResult();
                }}
              />
            </View>

            {rateMode === 'annual' ? (
              <Field
                label="Annual Interest Rate (%)"
                value={annualRate}
                onChangeText={(value) => {
                  setAnnualRate(value);
                  setErrors((current) => ({
                    ...current,
                    annualRate: undefined,
                  }));
                  resetResult();
                }}
                error={errors.annualRate}
                decimal
              />
            ) : (
              <Field
                label="Monthly Interest per ₹100 (₹)"
                value={monthlyRatePer100}
                onChangeText={(value) => {
                  setMonthlyRatePer100(value);
                  setErrors((current) => ({
                    ...current,
                    monthlyRatePer100: undefined,
                  }));
                  resetResult();
                }}
                error={errors.monthlyRatePer100}
                decimal
              />
            )}

            <Text style={styles.sectionLabel}>
              Compounding Frequency
            </Text>
            <View style={styles.choiceGroup}>
              {frequencies.map((frequency) => (
                <Choice
                  key={frequency.value}
                  label={frequency.label}
                  selected={
                    compoundingFrequency === frequency.value
                  }
                  onPress={() => {
                    setCompoundingFrequency(frequency.value);
                    setErrors((current) => ({
                      ...current,
                      compoundingFrequency: undefined,
                    }));
                    resetResult();
                  }}
                />
              ))}
            </View>

            {errors.compoundingFrequency ? (
              <Text
                accessibilityRole="alert"
                style={styles.errorText}
              >
                {errors.compoundingFrequency}
              </Text>
            ) : null}

            <Text style={styles.sectionLabel}>Duration Type</Text>
            <View style={styles.choiceGroup}>
              <Choice
                label="Manual"
                selected={durationMode === 'manual'}
                onPress={() => {
                  setDurationMode('manual');
                  setErrors({});
                  resetResult();
                }}
              />
              <Choice
                label="Date range"
                selected={durationMode === 'date-range'}
                onPress={() => {
                  setDurationMode('date-range');
                  setErrors({});
                  resetResult();
                }}
              />
            </View>

            {durationMode === 'manual' ? (
              <>
                <Field
                  label="Years"
                  value={durationYears}
                  onChangeText={(value) => {
                    setDurationYears(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />
                <Field
                  label="Months (0–11)"
                  value={durationMonths}
                  onChangeText={(value) => {
                    setDurationMonths(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />
                <Field
                  label="Days"
                  value={durationDays}
                  onChangeText={(value) => {
                    setDurationDays(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />
              </>
            ) : (
              <>
                <Field
                  label="Start Date (YYYY-MM-DD)"
                  value={startDate}
                  placeholder="2024-01-01"
                  onChangeText={(value) => {
                    setStartDate(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />
                <Field
                  label="End Date (YYYY-MM-DD)"
                  value={endDate}
                  placeholder="2026-01-01"
                  onChangeText={(value) => {
                    setEndDate(value);
                    setErrors((current) => ({
                      ...current,
                      duration: undefined,
                    }));
                    resetResult();
                  }}
                />
                <Text style={styles.helperText}>
                  Date-based calculations use Actual/365.
                </Text>
              </>
            )}

            {errors.duration ? (
              <Text accessibilityRole="alert" style={styles.errorText}>
                {errors.duration}
              </Text>
            ) : null}

            <PrimaryButton
              title="Calculate Interest"
              onPress={handleCalculate}
            />
            <SecondaryButton title="Reset" onPress={handleReset} />
          </View>

          {result ? (
            <View
              accessibilityLabel="Calculation result"
              style={styles.resultCard}
            >
              <Text style={styles.resultHeading}>Your Results</Text>
              <Text style={styles.resultLabel}>Compound Interest</Text>
              <Text style={styles.resultAmount}>
                {formatCurrency(result.interest)}
              </Text>

              <View style={styles.separator} />

              <Text style={styles.resultLabel}>Total Amount</Text>
              <Text style={styles.resultTotal}>
                {formatCurrency(result.totalAmount)}
              </Text>

              {result.durationLabel ? (
                <View style={styles.resultDetail}>
                  <Text style={styles.resultLabel}>Duration</Text>
                  <Text style={styles.resultDetailValue}>
                    {result.durationLabel}
                  </Text>
                </View>
              ) : null}

              {result.annualRateEquivalent !== undefined ? (
                <View style={styles.resultDetail}>
                  <Text style={styles.resultLabel}>
                    Nominal Annual Rate Equivalent
                  </Text>
                  <Text style={styles.resultDetailValue}>
                    {result.annualRateEquivalent.toLocaleString('en-IN', {
                      maximumFractionDigits: 6,
                    })}
                    %
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


function HistoryScreen({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<CalculationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState('');

  async function loadHistory() {
    setLoading(true);
    setStorageError('');

    try {
      setEntries(await getCalculationHistory());
    } catch {
      setStorageError('Unable to load calculation history.');
    } finally {
      setLoading(false);
    }
  }

  // Load history whenever this screen mounts.
  React.useEffect(() => {
    void loadHistory();
  }, []);

  async function handleDelete(id: string) {
    try {
      setEntries(await deleteCalculationHistoryEntry(id));
    } catch {
      setStorageError('Unable to delete this calculation.');
    }
  }

  async function handleClear() {
    try {
      await clearCalculationHistory();
      setEntries([]);
      setStorageError('');
    } catch {
      setStorageError('Unable to clear calculation history.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹ Home</Text>
        </Pressable>

        <Text style={styles.screenTitle}>Calculation History</Text>
        <Text style={styles.screenDescription}>
          Your recent calculations, saved on this device.
        </Text>

        {storageError ? (
          <Text accessibilityRole="alert" style={styles.errorText}>
            {storageError}
          </Text>
        ) : null}

        {loading ? (
          <Text style={styles.helperText}>Loading history...</Text>
        ) : entries.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No calculations yet</Text>
            <Text style={styles.cardDescription}>
              Your completed calculations will appear here.
            </Text>
          </View>
        ) : (
          <>
            <SecondaryButton
              title="Clear All History"
              onPress={() => {
                void handleClear();
              }}
            />

            {entries.map((entry) => (
              <View key={entry.id} style={styles.resultCard}>
                <Text style={styles.cardTitle}>
                  {entry.type === 'simple-interest'
                    ? 'Simple Interest'
                    : 'Compound Interest'}
                </Text>

                <Text style={styles.helperText}>
                  {new Date(entry.createdAt).toLocaleString()}
                </Text>

                <View style={styles.resultDetail}>
                  <Text style={styles.resultLabel}>Principal</Text>
                  <Text style={styles.resultDetailValue}>
                    {formatCurrency(entry.principal)}
                  </Text>
                </View>

                <View style={styles.resultDetail}>
                  <Text style={styles.resultLabel}>Interest Earned</Text>
                  <Text style={styles.resultAmount}>
                    {formatCurrency(entry.interest)}
                  </Text>
                </View>

                <View style={styles.resultDetail}>
                  <Text style={styles.resultLabel}>Total Amount</Text>
                  <Text style={styles.resultTotal}>
                    {formatCurrency(entry.totalAmount)}
                  </Text>
                </View>

                <Text style={styles.helperText}>
                  Duration: {entry.durationLabel || 'Not specified'}
                </Text>

                {entry.type === 'compound-interest' &&
                entry.compoundingFrequency ? (
                  <Text style={styles.helperText}>
                    Compounding: {entry.compoundingFrequency}
                  </Text>
                ) : null}

                <SecondaryButton
                  title="Delete"
                  onPress={() => {
                    void handleDelete(entry.id);
                  }}
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'simple-interest' | 'compound-interest' | 'history'>('home');

  if (screen === 'simple-interest') {
    return <SimpleInterestScreen onBack={() => setScreen('home')} />;
  }
  if (screen === 'compound-interest') {
  return <CompoundInterestScreen onBack={() => setScreen('home')} />;
  }
  if (screen === 'history') {
  return <HistoryScreen onBack={() => setScreen('home')} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>CalcOS</Text>
            <Text style={styles.tagline}>
              Your everyday finance toolkit
            </Text>
          </View>

          <View style={styles.profileIcon}>
            <Text style={styles.profileInitial}>C</Text>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeEyebrow}>
            SMARTER FINANCIAL PLANNING
          </Text>
          <Text style={styles.welcomeTitle}>
            Make your money{'\n'}work smarter.
          </Text>
          <Text style={styles.welcomeDescription}>
            Simple, transparent calculations to help you make informed
            financial decisions.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Calculators</Text>
        <Text style={styles.homeSubtitle}>Available now</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => setScreen('simple-interest')}
          style={styles.calculatorCard}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>%</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Simple Interest</Text>
            <Text style={styles.cardDescription}>
              Calculate interest on your principal.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable
        accessibilityRole="button"
        onPress={() => setScreen('compound-interest')}
        style={styles.calculatorCard}
      >
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>↗</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Compound Interest</Text>
          <Text style={styles.cardDescription}>
            Calculate compound growth over time.
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      
      <Pressable
        accessibilityRole="button"
        onPress={() => setScreen('history')}
        style={styles.calculatorCard}
      >
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>↺</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Calculation History</Text>
          <Text style={styles.cardDescription}>
            View and manage your saved calculations.
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Built for clarity</Text>
          <Text style={styles.infoDescription}>
            Transparent calculations, flexible inputs, and easy-to-read
            results.
          </Text>
        </View>

        <Text style={styles.footer}>CALCOS · FINANCIAL CALCULATORS</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  homeContainer: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
  },
  screenContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  tagline: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 3,
  },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  welcomeSection: {
    marginTop: 34,
    marginBottom: 28,
    padding: 24,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
  },
  welcomeEyebrow: {
    color: '#D6E1FF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 14,
  },
  welcomeDescription: {
    color: '#E5ECFF',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  homeSubtitle: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginBottom: 14,
  },
  calculatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    minHeight: 98,
    marginBottom: 12,
  },
  disabledCard: {
    opacity: 0.75,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardIconText: {
    color: COLORS.primary,
    fontSize: 25,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  cardDescription: {
    color: COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  chevron: {
    color: COLORS.secondaryText,
    fontSize: 27,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#EAF7F1',
    borderRadius: 18,
    padding: 17,
    marginTop: 10,
  },
  infoTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  infoDescription: {
    color: COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  footer: {
    color: '#98A2B3',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 16,
    marginBottom: 16,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
  },
  screenDescription: {
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 22,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  fieldContainer: {
    marginBottom: 17,
  },
  fieldLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  sectionLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  choiceGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  choice: {
    flexGrow: 1,
    flexBasis: '40%',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  choiceText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  choiceTextSelected: {
    color: COLORS.primary,
  },
  helperText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -5,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    minHeight: 51,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    minHeight: 49,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 22,
    marginTop: 20,
  },
  resultHeading: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 22,
  },
  resultLabel: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginBottom: 6,
  },
  resultAmount: {
    color: COLORS.primary,
    fontSize: 29,
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  resultTotal: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '800',
  },
  resultDetail: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
    marginTop: 17,
  },
  resultDetailValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
import { FormInputField, FormSelectField, Label } from 'autocasting-ui-library-padimasso';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionCard } from '../../../../../../shared/components/Section';
import { useCachedSiteMetadataOption } from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useCastingRoleRemunerationPatchAutosave } from '../../../hooks/autosaves';
import { getCastingRoleRemunerationSchema } from '../../../schemas/formSchema';

const toComparableAmount = (value: unknown): number | null => {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const RoleRemunerationEditCard = ({ sectionId, data }: { sectionId: string; data: any }) => {
  const payRateTypeOptions = useCachedSiteMetadataOption('payRateTypeOptions', t);
  const currencyTypeOptions = useCachedSiteMetadataOption('currencyOptions', t);
  const autosave = useCastingRoleRemunerationPatchAutosave(sectionId);
  const backendFieldErrors = autosave.fieldErrors as Record<string, string | undefined>;

  const schema = useMemo(() => getCastingRoleRemunerationSchema(t), []);

  const unpaidLabel = t('sitemetadata.pay_rate_type.unpaid');
  const unpaidOptionId = useMemo(() => {
    const opt = (payRateTypeOptions ?? []).find((o: any) => o.label === unpaidLabel);
    return opt?.value ?? '';
  }, [payRateTypeOptions, unpaidLabel]);

  const initialPayRateTypeId = data.payRateType?.id ?? '';
  const initialCurrencyId = data.currency?.id ?? '';
  const initialAmount = data.amount ?? '';

  const [payRateTypeId, setPayRateTypeId] = useState<string>(initialPayRateTypeId);
  const [currencyId, setCurrencyId] = useState<string>(initialCurrencyId);
  const [amount, setAmount] = useState<string>(String(initialAmount ?? ''));
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [lastSentPayRateTypeId, setLastSentPayRateTypeId] = useState<string>(initialPayRateTypeId);
  const [lastSentCurrencyId, setLastSentCurrencyId] = useState<string>(initialCurrencyId);
  const [lastSentAmount, setLastSentAmount] = useState<number | null>(toComparableAmount(data.amount));

  useEffect(() => {
    const nextPayRateTypeId = data.payRateType?.id ?? '';
    const nextCurrencyId = data.currency?.id ?? '';
    const nextAmount = data.amount ?? null;

    setPayRateTypeId(nextPayRateTypeId);
    setCurrencyId(nextCurrencyId);
    setAmount(String(data.amount ?? ''));
    setAmountError(undefined);
    setLastSentPayRateTypeId(nextPayRateTypeId);
    setLastSentCurrencyId(nextCurrencyId);
    setLastSentAmount(toComparableAmount(nextAmount));
  }, [data.id, data.payRateType?.id, data.currency?.id, data.amount]);

  const isUnpaid = Boolean(unpaidOptionId) && payRateTypeId === unpaidOptionId;

  const clearAmountState = useCallback(() => {
    setAmount('');
    setAmountError(undefined);
  }, []);

  const handlePayRateTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value;
      if (!next) return;

      setPayRateTypeId(next);
      setAmountError(undefined);

      if (unpaidOptionId && next === unpaidOptionId) {
        clearAmountState();
        if (next === lastSentPayRateTypeId && lastSentAmount == null) return;
        setLastSentPayRateTypeId(next);
        setLastSentAmount(null);
        autosave.immediate({
          id: data.id,
          payRateTypeId: next,
          amount: null,
        });
        return;
      }

      if (next === lastSentPayRateTypeId) return;

      setLastSentPayRateTypeId(next);
      autosave.immediate({
        id: data.id,
        payRateTypeId: next,
      });
    },
    [autosave, clearAmountState, data.id, lastSentAmount, lastSentPayRateTypeId, unpaidOptionId]
  );

  const handleCurrencyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value;
      if (!next) return;

      setCurrencyId(next);
      setAmountError(undefined);

      if (next === lastSentCurrencyId) return;

      setLastSentCurrencyId(next);
      autosave.immediate({
        id: data.id,
        currencyId: next,
      });
    },
    [autosave, data.id, lastSentCurrencyId]
  );

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setAmountError(undefined);
  }, []);

  const handleAmountBlur = useCallback(() => {
    const v = (amount ?? '').trim();

    // Empty => validate with amount=null, then persist null
    if (!v) {
      const parsed = schema.safeParse({
        id: data.id,
        payRateTypeId,
        currencyId,
        amount: null,
      });

      if (!parsed.success) {
        const msg = parsed.error.flatten().fieldErrors?.amount?.[0];
        setAmountError(msg);
        return;
      }

      if (lastSentAmount === null) return;

      setLastSentAmount(null);
      autosave.immediate({ id: data.id, amount: null });
      return;
    }

    const normalized = v.replace(',', '.');
    const num = Number(normalized);
    const candidate = Number.isFinite(num) ? num : Number.NaN;

    const parsed = schema.safeParse({
      id: data.id,
      payRateTypeId,
      currencyId,
      amount: candidate,
    });

    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors?.amount?.[0];
      setAmountError(msg);
      return;
    }

    if (lastSentAmount === num) return;

    setLastSentAmount(num);
    autosave.immediate({ id: data.id, amount: num });
  }, [amount, autosave, currencyId, data.id, lastSentAmount, payRateTypeId, schema]);

  const resolveError = (field: string, local?: string) => local ?? backendFieldErrors[field] ?? undefined;

  return (
    <SectionCard>
      <h2 className="text-base font-semibold">{data.roleName}</h2>

      <div className="mt-4">
        <FormSelectField
          id={`payRateTypeId-${data.id}`}
          placeholder={t('general.placeholder.select')}
          value={payRateTypeId}
          onChange={handlePayRateTypeChange}
          options={payRateTypeOptions}
          label={t('employer_castings.dashboard.remunerations.remuneration.pay_rate_type_label')}
          labelClassName="font-semibold text-base"
          error={resolveError('payRateTypeId')}
          required
        />
      </div>

      {!isUnpaid ? (
        <div>
          <div className="flex">
            <Label className="text-base font-semibold">
              {t('employer_castings.dashboard.remunerations.remuneration.amount_label')}
            </Label>
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          </div>

          <div className="mt-2 flex flex-row items-center gap-3">
            <div className="w-[110px]">
              <FormSelectField
                id={`currencyId-${data.id}`}
                placeholder={t('general.placeholder.select')}
                value={currencyId}
                onChange={handleCurrencyChange}
                options={currencyTypeOptions}
                error={resolveError('currencyId')}
              />
            </div>

            <div className="flex-1">
              <FormInputField
                id={`amount-${data.id}`}
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                error={resolveError('amount', amountError)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
};

export default RoleRemunerationEditCard;

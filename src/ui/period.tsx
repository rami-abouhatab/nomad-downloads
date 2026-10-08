/**
 * Yearly or monthly: one choice per page, made with nomad-design's Segment.
 *
 * Every price and every buy link on a page reads the same context, so the
 * switch above the plans and the one beside an app's card can never disagree.
 * The prerendered page shows yearly (the law's default: "push annual"); the
 * switch works once the page has hydrated.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Segment } from '@nd/controls/Segment';
import { PRICES, type Period, type ProductId } from '../data';

const Ctx = createContext<{ period: Period; setPeriod: (p: Period) => void }>({
  period: 'yearly',
  setPeriod: () => {},
});

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>('yearly');
  return <Ctx.Provider value={{ period, setPeriod }}>{children}</Ctx.Provider>;
}

export const usePeriod = () => useContext(Ctx).period;

export function PeriodSwitch({ className }: { className?: string }) {
  const { period, setPeriod } = useContext(Ctx);
  return (
    <div className={className ? `period-switch ${className}` : 'period-switch'}>
      <Segment<Period>
        size="md"
        aria-label="Billing period"
        value={period}
        onChange={setPeriod}
        options={[
          { id: 'yearly', label: 'Yearly' },
          { id: 'monthly', label: 'Monthly' },
        ]}
      />
      <span className="period-save">Yearly is two months free</span>
    </div>
  );
}

/** "$99 a year" or "$9.99 a month", following the switch. */
export function PriceText({ product }: { product: ProductId }) {
  const period = usePeriod();
  const p = PRICES[product];
  return <>{period === 'yearly' ? `${p.yearly} a year` : `${p.monthly} a month`}</>;
}

/** The big figure on a plan card, with the line under it. */
export function PriceBlock({ product }: { product: ProductId }) {
  const period = usePeriod();
  const p = PRICES[product];
  return (
    <div className="price">
      <p className="price-big">
        {period === 'yearly' ? p.yearly : p.monthly}{' '}
        <small>{period === 'yearly' ? 'a year' : 'a month'}</small>
      </p>
      <p className="price-sub">
        {period === 'yearly'
          ? `${p.perMonthYearly} a month, billed yearly. Two months free.`
          : `Or ${p.yearly} a year, which is two months free.`}
      </p>
    </div>
  );
}

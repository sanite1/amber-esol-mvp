import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { paymentsPageData as initialData } from "../../data/student/paymentsData";
import {
  SummaryCardsSkeleton,
  TransactionsSkeleton,
  PaymentMethodsSkeleton,
} from "../../components/student/payments/PaymentsSkeleton";
import SummaryCards from "../../components/student/payments/SummaryCards";
import UpcomingPaymentsBanner from "../../components/student/payments/UpcomingPaymentsBanner";
import TransactionList from "../../components/student/payments/TransactionList";
import PaymentMethodsCard from "../../components/student/payments/PaymentMethodsCard";

export default function Payments() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleRemoveMethod = (id: string) => {
    setData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((m) => m.id !== id),
    }));
  };

  const handleSetDefault = (id: string) => {
    setData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    }));
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-32 h-5 bg-[#0B2343]/[0.06] rounded-lg animate-pulse" />
            <div className="w-52 h-3 bg-[#0B2343]/[0.04] rounded-lg animate-pulse" />
          </div>
        </div>
        <SummaryCardsSkeleton />
        <TransactionsSkeleton />
        <PaymentMethodsSkeleton />
      </div>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
          <CreditCard size={20} className="text-[#ff7c22]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#0B2343]">Payments</h1>
          <p className="text-xs text-[#0B2343]/40">
            Your lesson bookings, transaction history, and payment methods
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <SummaryCards summary={data.summary} />

      {/* Upcoming lessons banner */}
      <UpcomingPaymentsBanner transactions={data.transactions} />

      {/* Transaction history */}
      <TransactionList transactions={data.transactions} />

      {/* Payment methods */}
      <PaymentMethodsCard
        methods={data.paymentMethods}
        onAdd={() => {
          /* TODO: open Stripe card form */
        }}
        onRemove={handleRemoveMethod}
        onSetDefault={handleSetDefault}
      />
    </div>
  );
}

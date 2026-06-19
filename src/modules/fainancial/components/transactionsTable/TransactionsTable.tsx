// TransactionsTable.tsx
"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import ReusableTable from "@/components/reusable-table/ReusableTable";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { TransactionCurrency } from "@/modules/fainancial/types/transaction";
import { Calendar, CreditCard, Folder, Settings, User2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetTransactions } from "../../hooks/transactions/useGetTransactions";
import AddTransactionForm from "./AddTransactionForm";
import { currencyOptions } from "./AddTransactionForm";
import TransactionRowTable from "./TransactionRowTable";
import { usePermissionStore } from "@/hooks/usePermissionStore";

const CURRENCY_STORAGE_KEY = "transactions-table-currency";

function TransactionsTable() {
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const { canCreate, hasPermission } = usePermissionStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const section_id = searchParams.get("section_id") ?? undefined;
  const currencyFromUrl = searchParams.get("currency");
  const [selectedCurrency, setSelectedCurrency] = useState<TransactionCurrency>(
    currencyFromUrl === "USD" ? "USD" : "SYP",
  );

  const { data: transactionsData, isPending } = useGetTransactions({
    currency: selectedCurrency,
  });
  const t = useTranslations("Dashboard.TransactionsPage");
  const tHeaders = useTranslations("Dashboard.tableHeaders");

  const config = {
    title: t("title"),
    createLabel: t("createNewTransaction"),
    description: t("createTransactionDescription"),
    permission: "transactions",
  };

  useEffect(() => {
    if (currencyFromUrl === "SYP" || currencyFromUrl === "USD") {
      setSelectedCurrency(currencyFromUrl);
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, currencyFromUrl);
      return;
    }

    const savedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    const nextCurrency: TransactionCurrency =
      savedCurrency === "USD" ? "USD" : "SYP";

    setSelectedCurrency(nextCurrency);

    const params = new URLSearchParams(searchParams.toString());
    params.set("currency", nextCurrency);

    router.replace("?" + params.toString(), { scroll: false });
  }, [currencyFromUrl, router, searchParams]);

  const handleCurrencyChange = (value: string) => {
    if (value !== "SYP" && value !== "USD") return;

    setSelectedCurrency(value);
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("currency", value);
    if (params.has("page")) {
      params.set("page", "1");
    }

    router.replace("?" + params.toString(), { scroll: false });
  };

  const tableActionButton = (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="rounded-xl border bg-background px-3 py-2 shadow-sm">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          {t("fields.currency")}
        </div>
        <RadioGroup
          value={selectedCurrency}
          onValueChange={handleCurrencyChange}
          className="flex gap-3"
        >
          {currencyOptions.map((option) => {
            const id = `transactions-table-currency-${option.value}`;
            const isActive = selectedCurrency === option.value;

            return (
              <label
                key={option.value}
                htmlFor={id}
                className={cn(
                  "flex min-w-24 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground",
                )}
              >
                <RadioGroupItem value={option.value} id={id} />
                <span>{option.label}</span>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <ResponsiveModal
        trigger={
          canCreate(config.permission) || hasPermission("finance.view") ? (
            <Button variant="premium">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>{config.createLabel}</span>
            </Button>
          ) : null
        }
        title={config.createLabel}
        description={config.description}
        open={addTransactionModalOpen}
        onOpenChange={setAddTransactionModalOpen}
        maxWidth="xl"
        height="auto"
      >
        {hasPermission("finance.view") || hasPermission("sub-finance.view") ? (
          <AddTransactionForm
            onSuccess={() => setAddTransactionModalOpen(false)}
            section_id={section_id}
          />
        ) : (
          <div className="p-8 text-center ">
            <p className="text-sm sm:text-base text-red-400">
              {t("noFinancePermission")}
            </p>
          </div>
        )}
      </ResponsiveModal>
    </div>
  );

  const TABLE_HEADERS: {
    Icon: React.ReactNode;
    label: string;
    className?: string;
  }[] = [
    { Icon: <Folder className="h-4 w-4" />, label: tHeaders("id") },
    { Icon: <Settings className="h-4 w-4" />, label: tHeaders("actions") },
    { Icon: <User2 className="h-4 w-4" />, label: tHeaders("name") },
    {
      Icon: <CreditCard className="h-4 w-4" />,
      label: tHeaders("description"),
    },
    { Icon: <CreditCard className="h-4 w-4" />, label: tHeaders("amount") },
    { Icon: <Folder className="h-4 w-4" />, label: tHeaders("section") },
    {
      Icon: <Calendar className="h-4 w-4" />,
      label: tHeaders("dateTransaction"),
    },
    { Icon: <Calendar className="h-4 w-4" />, label: tHeaders("createdAt") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-card shadow-sm">
          <h4 className="text-muted-foreground text-sm">{t("totalSpends")}</h4>
          <p className="text-2xl font-semibold text-red-500">
            {transactionsData?.data.total_spends ?? 0}
          </p>
        </div>

        <div className="p-4 rounded-2xl border bg-card shadow-sm">
          <h4 className="text-muted-foreground text-sm">
            {t("totalEarnings")}
          </h4>
          <p className="text-2xl font-semibold text-green-500">
            {transactionsData?.data.total_earnings ?? 0}
          </p>
        </div>

        <div className="p-4 rounded-2xl border bg-card shadow-sm">
          <h4 className="text-muted-foreground text-sm">{t("netProfit")}</h4>
          <p className="text-2xl font-semibold text-blue-500">
            {transactionsData?.data.net_profit ?? 0}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <ReusableTable
          titleIcon={<CreditCard className="h-5 w-5 text-primary" />}
          title={config.title}
          description={config.description}
          actionButton={tableActionButton}
          headers={TABLE_HEADERS}
          data={transactionsData?.data.transactions.data || []}
          isPending={isPending}
          paginationProps={
            transactionsData?.data?.transactions?.data?.length
              ? {
                  name: config.permission,
                  totalItems: transactionsData?.data.transactions?.total || 0,
                  totalPages:
                    transactionsData?.data?.transactions?.last_page || 1,
                }
              : undefined
          }
          density="md"
          height={64}
          renderRow={(transaction) => (
            <TransactionRowTable
              key={transaction.id}
              data={transaction}
              permissionKey={config.permission}
            />
          )}
        />
      </div>
    </div>
  );
}

export default TransactionsTable;

// LogItem.tsx
import { useTranslations } from "next-intl";
import Image from "next/image";
import { extractChanges } from "../utils/changeLogsUtils";
import ChangesTable from "./ChangesTable";

export const renderLogContent = (
  actionKey: string,
  changes: any,
  log?: any,
  t?: any
) => {
  const renderers = {
    added: () => <ProductAdded changes={changes} action={log.action} t={t} />,
    deleted: () => (
      <ProductDeleted changes={changes} action={log.action} t={t} />
    ),
    updated_quantity: () => (
      <QuantityUpdated changes={changes} log={log} t={t} />
    ),
    returned_item: () => (
      <ItemReturned changes={changes} action={log.action} t={t} />
    ),
    unreturned_item: () => (
      <ItemUnreturned changes={changes} action={log.action} t={t} />
    ),
    taken: () => <SimpleMessage message={log.action} t={t} />,
    released: () => <SimpleMessage message={log.action} t={t} />,
    completed: () => (
      <OrderCompleted changes={changes} action={log.action} t={t} />
    ),
    updated_status: () => (
      <StatusUpdated changes={changes} action={log.action} t={t} />
    ),
  };

  const renderer = renderers[actionKey as keyof typeof renderers];
  return renderer ? renderer() : <DefaultRenderer changes={changes} />;
};

const LogItem = ({ log }: { log: any }) => {
  const t = useTranslations("Dashboard.OrdersPage.ordersLogs.changes");
  const { oldValues, newValues } = extractChanges(log.changes);

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs text-gray-500">
          {log.created_at} {t("by")} {log.user?.name || t("unknownUser")}
        </p>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {t(log.action_key)}
        </span>
      </div>

      {renderLogContent(
        log.action_key,
        {
          ...newValues,
          old: oldValues,
          new: newValues,
        },
        log,
        t
      )}
    </div>
  );
};

export default LogItem;

const ProductAdded = ({
  changes,
  action,
  t,
}: {
  changes: any;
  action: string;
  t: any;
}) => (
  <div className="p-3 rounded-lg border ">
    <p className="text-sm font-medium text-green-800 mb-2">{action}</p>
    <ProductBasicInfo changes={changes} t={t} />
  </div>
);

const ProductDeleted = ({
  changes,
  action,
  t,
}: {
  changes: any;
  action: string;
  t: any;
}) => (
  <div className="p-3 rounded-lg border ">
    <p className="text-sm font-medium text-red-800 mb-2">{action}</p>
    <ProductBasicInfo changes={changes} t={t} />
  </div>
);

const QuantityUpdated = ({
  changes,
  log,
  t,
}: {
  changes: any;
  log: any;
  t: any;
}) => (
  <div className="p-3 rounded-lg border ">
    <ProductHeader changes={changes} t={t} />
    <ChangesTable changes={changes} log={log} t={t} />
  </div>
);

const ItemReturned = ({
  changes,
  action,
  t,
}: {
  changes: any;
  action: string;
  t: any;
}) => (
  <div className="p-3 rounded-lg border">
    <p className="text-sm font-medium text-blue-800 mb-2">{action ?? ""}</p>
    <ReturnTable changes={changes} t={t} />
  </div>
);

const ItemUnreturned = ({
  changes,
  action,
  t,
}: {
  changes: any;
  action: string;
  t: any;
}) => (
  <div className="p-3 rounded-lg border ">
    <p className="text-sm font-medium text-purple-800 mb-2">{action}</p>
    <ReturnTable changes={changes} t={t} />
  </div>
);

const OrderCompleted = ({
  changes,
  action,
  t,
}: {
  changes: any;
  action: string;
  t: any;
}) => (
  <div className="p-3 rounded-lg border">
    <p className="text-sm font-medium text-indigo-800 mb-2">
      {action ?? t("completed")}
    </p>
    {changes.notes && (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">{t("notes")}:</span> {changes.notes}
      </p>
    )}
  </div>
);

const StatusUpdated = ({
  changes,
  action,
  t,
}: {
  changes: any;
  action: string;
  t: any;
}) => (
  <div className="p-3 rounded-lg border ">
    <p className="text-sm font-medium text-orange-800 mb-2">
      {action ?? t("updated_status")}
    </p>
    <ChangesTable changes={changes} t={t} />
  </div>
);

const SimpleMessage = ({ message, t }: { message: string; t: any }) => (
  <div className="p-3 rounded-lg border ">
    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
      {message}
    </p>
  </div>
);

const DefaultRenderer = ({ changes }: { changes: any }) => (
  <div className="p-3 rounded-lg">
    <pre className="text-xs">{JSON.stringify(changes, null, 2)}</pre>
  </div>
);

const ProductHeader = ({ changes, t }: { changes: any; t: any }) => (
  <div className="flex items-center gap-3 mb-3">
    {changes.product_image && (
      <div className="relative w-12 h-12 flex-shrink-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${changes.product_image}`}
          alt={changes.product_name || t("product")}
          fill
          className="object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-product.jpg";
          }}
        />
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {changes.product_name || t("product")}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        {changes.size && `${t("size")}: ${changes.size}`}
        {changes.size && changes.color && " - "}
        {changes.color && `${t("color")}: ${changes.color}`}
      </p>
    </div>
  </div>
);

const ProductBasicInfo = ({ changes, t }: { changes: any; t: any }) => (
  <div className="space-y-1 text-gray-700 dark:text-gray-200">
    <p className="text-sm">
      <span className="font-medium">{t("product")}:</span>{" "}
      {changes.product_name}
    </p>
    <p className="text-sm">
      <span className="font-medium">{t("quantity")}:</span> {changes.quantity}
    </p>
    {changes.purchase_price && (
      <p className="text-sm">
        <span className="font-medium">{t("price")}:</span>{" "}
        {changes.purchase_price}
      </p>
    )}
  </div>
);

const ReturnTable = ({ changes, t }: { changes: any; t: any }) => (
  <table className="w-full text-sm text-right">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 font-medium">{t("field")}</th>
        <th className="p-2 font-medium">{t("oldValue")}</th>
        <th className="p-2 font-medium">{t("newValue")}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="p-2 font-medium">{t("returnedQuantity")}</td>
        <td className="p-2">{changes.old?.returned_quantity ?? 0}</td>
        <td className="p-2">{changes.new?.returned_quantity ?? 0}</td>
      </tr>
    </tbody>
  </table>
);

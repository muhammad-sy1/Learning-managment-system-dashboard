import { SafeImage } from "@/components/SafeImage";
import { TableCell } from "@/components/ui/table";
import { formatUtcToLocal } from "@/utils/formatDate";
import UserTableActions from "./UserTableActions";
import { IUser } from "../../types/users";

export default function UserRowTable({
  data,
  configTranslate,
  mappedKey,
}: {
  data: IUser;
  mappedKey: string | undefined;
  configTranslate: Record<string, string>;
}) {
  return (
    <>
      <TableCell className=" py-3">{data.id}</TableCell>
      <TableCell>
        <UserTableActions
          data={data}
          mappedKey={mappedKey}
          configTranslate={configTranslate}
        />
      </TableCell>
      <TableCell className="font-medium flex justify-center items-center  gap-3">
        <div className="flex justify-center w-25 items-center">
          <div className="relative rounded-full ">
            <SafeImage
              imageUrl={data.name}
              alt={data.name ?? "User image"}
              className="h-10 w-10 rounded-full"
            />
            {/* {permissionKey === "merchants" && (
              <>
                <span
                  className={`rounded-full size-3.5 top-0 -start-1 ${data.is_open ? "bg-green-500" : "bg-red-500"} absolute`}
                ></span>
              </>
            )} */}
          </div>
        </div>
      </TableCell>

      {/* {permissionKey === "merchants" && (
        <TableCell className="font-medium gap-3">
          <div className="flex justify-center w-25 items-center">
            <div className="relative rounded-full ">
              <SafeImage
                imageUrl={data.cover_image}
                alt={data.first_name ?? "User image"}
                className="h-10 w-10 rounded-full"
              />
            </div>
          </div>
        </TableCell>
      )} */}

      <TableCell>
        <span className="truncate">{data.name}</span>
      </TableCell>

      {/* <TableCell>{data.last_name}</TableCell> */}
      <TableCell>{data.email}</TableCell>

      {/* <TableCell>{data.bio ?? "-"}</TableCell> */}
      {/* 
      {permissionKey === "merchants" && (
        <>
          <TableCell>{data.store_name ?? <span>-</span>}</TableCell>
          <TableCell>{data.store_location ?? <span>-</span>}</TableCell>
          <TableCell>{data.total_sales ?? <span>-</span>}</TableCell>
          <TableCell>{data.total_app_commission ?? <span>-</span>}</TableCell>
          <TableCell>{data.order_discounts_total ?? <span>-</span>}</TableCell>
          <TableCell>
            {data.total_other_transactions ?? <span>-</span>}
          </TableCell>
          <TableCell>{data.total_final_amount ?? <span>-</span>}</TableCell>
          <TableCell>
            {data.app_commession != null ? (
              `${data.app_commession}%`
            ) : (
              <span>-</span>
            )}
          </TableCell>
        </>
      )}

      {permissionKey === "delivery" && (
        <>
          <TableCell>
            {(() => {
              const roleKey = getRoleKey(data);
              const role = roleConfig[roleKey];

              return (
                <Badge variant={role.variant} className={role.className}>
                  {role.label}
                </Badge>
              );
            })()}
          </TableCell>

          <TableCell>
            {data.delivery_manager ? (
              <>
                <NavLink
                  href={`/dashboard/users?role=DELIVERY&id=${data.delivery_manager.id}`}
                >
                  {data.delivery_manager.first_name}{" "}
                  {data.delivery_manager.last_name}
                </NavLink>
              </>
            ) : (
              <>-</>
            )}
          </TableCell>
          <TableCell>{data.orders_total_income ?? <span>-</span>}</TableCell>
          <TableCell>
            {data.shipping_discounts_total ?? <span>-</span>}
          </TableCell>
          <TableCell>{data.order_discounts_total ?? <span>-</span>}</TableCell>
          <TableCell>{data.total_app_commission ?? <span>-</span>}</TableCell>
          <TableCell>
            {data.total_other_transactions ?? <span>-</span>}
          </TableCell>
          <TableCell>{data.total_final_amount ?? <span>-</span>}</TableCell>
          <TableCell>
            {data.app_commession != null ? (
              `${data.app_commession}%`
            ) : (
              <span>-</span>
            )}
          </TableCell>
        </>
      )} */}

      {/* <TableCell>
        {data.blocked_at ? (
          <span>
            {t("blocked")} {t("at")} {formatUtcToLocal(data.blocked_at)}
          </span>
        ) : (
          <span>{t("unblocked")}</span>
        )}
      </TableCell>
      <TableCell>
        {data.country_code && data.phone_number ? (
          <div dir="ltr">
            +{data.country_code} {data.phone_number}
          </div>
        ) : (
          <span
          // className="text-red-500"
          >
            ---
          </span>
        )}
      </TableCell> */}
      <TableCell>
        {/* {new Date(data.created_at).toLocaleDateString()} */}
        {formatUtcToLocal(data.created_at)}
      </TableCell>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import GoogleMapsLoader from "@/components/map/GoogleMapsLoader";
import GooglePolygonEditor from "@/components/map/GooglePolygonEditor";
import { SearchMapInput } from "@/components/map/SearchMapInput";

import useCreateZone from "../../hooks/useCreateZone";
import { addZoneSchema } from "../../schemas/addZoneSchema";

type LatLng = { lat: number; lng: number };

const defaultValues = {
  name: "",
  shipping_fee: "",
  speedy_shipping_fee: "",
  center: { lat: 33.5138, lng: 36.2765 },
  polygon: [] as LatLng[],
};

export default function AddZoneForm({ onSuccess }: any) {
  const t = useTranslations("Dashboard.ZonePage");
  const { mutate, isPending } = useCreateZone();

  const form = useForm({
    resolver: zodResolver(addZoneSchema(t)),
    defaultValues,
  });

  // ✅ Local state for smooth editing (no RHF watch)
  const [center, setCenter] = useState<LatLng>(defaultValues.center);
  const [poly, setPoly] = useState<LatLng[]>(defaultValues.polygon);

  // Sync local -> RHF
  useEffect(() => {
    form.setValue("center", center, { shouldDirty: true, shouldValidate: true });
  }, [center, form]);

  useEffect(() => {
    form.setValue("polygon", poly, { shouldDirty: true, shouldValidate: true });
  }, [poly, form]);

  function handlePlaceSelect(place: any) {
    const delta = 0.002;

    const newPoly: LatLng[] = [
      { lat: place.lat + delta, lng: place.lng - delta },
      { lat: place.lat + delta, lng: place.lng + delta },
      { lat: place.lat - delta, lng: place.lng + delta },
      { lat: place.lat - delta, lng: place.lng - delta },
    ];

    setCenter({ lat: place.lat, lng: place.lng });
    setPoly(newPoly);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6 mt-4"
        onSubmit={form.handleSubmit((v) =>
          mutate(
            { ...v, center, polygon: poly },
            { onSuccess: () => onSuccess?.() },
          ),
        )}
      >
        <SearchMapInput onSelectPlace={handlePlaceSelect} markerPosition={center} />

        <GoogleMapsLoader>
          {(loaded) => (
            <GooglePolygonEditor
              loaded={loaded}
              center={center}
              polygon={poly}
              onChange={setPoly}
            />
          )}
        </GoogleMapsLoader>

        <FormInput name="name" label={t("name")} />

        <Button type="submit" disabled={isPending} className="w-full h-12">
          {isPending ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              {t("creatingButton")}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("createButton")}
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}

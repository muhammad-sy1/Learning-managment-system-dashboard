"use client";

import { useEffect, useState } from "react";
import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import GoogleMapsLoader from "@/components/map/GoogleMapsLoader";
import GooglePolygonEditor from "@/components/map/GooglePolygonEditor";
import PlaceSearch from "@/components/map/PlaceSearch";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import { MapPin } from "lucide-react";

import useUpdateZone from "../../hooks/useUpdateZone";
import { editZoneSchema } from "../../schemas/editZoneSchema";
import { IZone } from "../../types/zone";

type LatLng = { lat: number; lng: number };

interface IEditProvinceFormProps {
  data: IZone;
  onSuccess?: () => void;
}

function getPolygonCenter(polygon: LatLng[]) {
  const lat = polygon.reduce((sum, p) => sum + p.lat, 0) / polygon.length;
  const lng = polygon.reduce((sum, p) => sum + p.lng, 0) / polygon.length;
  return { lat, lng };
}

export default function EditZoneForm({ data, onSuccess }: IEditProvinceFormProps) {
  const { mutate, isPending } = useUpdateZone();
  const formT = useTranslations("Dashboard.ZonePage");

  const form = useForm<editZoneSchema>({
    resolver: zodResolver(editZoneSchema(formT)),
  });

  // ✅ Local state for smooth map editing
  const [center, setCenter] = useState<LatLng>({ lat: 33.5138, lng: 36.2765 });
  const [poly, setPoly] = useState<LatLng[]>([]);

  // initialize from data
  useEffect(() => {
    if (!data) return;

    const c = getPolygonCenter(data.polygon);

    setCenter(c);
    setPoly(data.polygon);

    form.reset({
      name: data.name,
      center: c,
      polygon: data.polygon,
    });
  }, [data, form]);

  // Sync local -> RHF
  useEffect(() => {
    form.setValue("center", center, { shouldDirty: true, shouldValidate: true });
  }, [center, form]);

  useEffect(() => {
    form.setValue("polygon", poly, { shouldDirty: true, shouldValidate: true });
  }, [poly, form]);

  function onSubmit(values: editZoneSchema) {
    const dirtyValues = getDirtyValues(form.formState.dirtyFields, values) ?? {};

    mutate(
      { id: data.id, provinceData: values },
      { onSuccess: () => onSuccess?.() },
    );
  }

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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6">
            <PlaceSearch onSelect={handlePlaceSelect} />

            <GoogleMapsLoader>
              {(loaded) => (
                <GooglePolygonEditor
                  loaded={loaded}
                  center={center}
                  polygon={poly}
                  onChange={(pts) => setPoly(pts)}
                />
              )}
            </GoogleMapsLoader>

            <FormInput<editZoneSchema>
              name="name"
              placeholder={formT("namePlaceholder")}
              label={formT("namePlaceholder")}
              Icon={<MapPin className="size-4" />}
            />

            <Button
              disabled={isPending || !form.formState.isDirty}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="w-4 h-4" />
                  <span>{formT("updatingButton")}</span>
                </div>
              ) : (
                formT("updateButton")
              )}
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}

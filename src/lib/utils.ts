import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirtyValues<T>(
  dirty: any,
  values: T,
): Partial<T> | undefined {
  if (Array.isArray(dirty)) {
    const out = dirty
      .map((marker, idx) => {
        if (!marker) return undefined;
        const v = (values as any)?.[idx];
        if (v === undefined) return undefined;
        if (typeof marker === "object") return getDirtyValues(marker, v);
        return v;
      })
      .filter((x) => x !== undefined);
    return out.length ? (out as unknown as Partial<T>) : undefined;
  }

  if (dirty && typeof dirty === "object") {
    const acc: Record<string, any> = {};
    for (const key of Object.keys(dirty)) {
      const marker = dirty[key];
      const v = (values as any)?.[key];
      if (!marker) continue;
      if (Array.isArray(marker) || typeof marker === "object") {
        const nested = getDirtyValues(marker, v);
        if (
          nested !== undefined &&
          (Array.isArray(nested) ? nested.length : Object.keys(nested).length)
        ) {
          acc[key] = nested;
        }
      } else {
        acc[key] = v;
      }
    }
    return Object.keys(acc).length ? (acc as Partial<T>) : undefined;
  }

  return dirty ? (values as Partial<T>) : undefined;
}

export function appendIfDefined(fd: FormData, key: string, val: unknown) {
  if (val === undefined || val === null) return;
  if (val instanceof Blob) {
    fd.append(key, val); // optionally add filename if it's a File
  } else {
    fd.append(key, String(val));
  }
}

export function jsonToFormData(
  data: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string,
): FormData {
  Object.entries(data).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (formKey.startsWith("images")) {
      // skip images now
      return;
    }

    // if (
    //   (value === null && formKey !== "image") ||
    //   value === undefined ||
    //   value === ""
    // ) {
    //   return value;
    // }

    if (value === undefined || value === "") return;

    if (value === null) {
      formData.append(formKey, "");
      return;
    }

    if (formKey === "image" && value === null) {
      formData.append(formKey, value);
      return;
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        jsonToFormData({ [index]: item }, formData, formKey);
      });
    } else if (typeof value === "object") {
      jsonToFormData(value, formData, formKey);
    } else {
      formData.append(formKey, String(value));
    }
  });

  return formData;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

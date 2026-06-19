"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function LocaleEntry() {
    const router = useRouter();
    const { locale } = useParams() as { locale: string };

    useEffect(() => {
        const token = Cookies.get("token");
        router.replace(token ? `/${locale}/dashboard` : `/${locale}/login`);
    }, [router, locale]);

    return null; // or your <Loading/>a
}

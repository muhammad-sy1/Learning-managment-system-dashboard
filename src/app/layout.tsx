// app/layout.tsx

import { ReactNode } from "react";
import "@/styles/globals.css";

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: "Lista Stores",
  description: "متجر الكتروني",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }: Props) {
  return children;
}

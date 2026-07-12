// app/layout.tsx

import { ReactNode } from "react";
import "@/styles/globals.css";

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: "Nibras LMS",
  description: "Learning Management System for Teachers and Students",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Props) {
  return children;
}

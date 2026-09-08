import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Problem Solving · Method Studio",
  description: "Compare editable method templates in Excalidraw, React Flow, and Tiptap.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

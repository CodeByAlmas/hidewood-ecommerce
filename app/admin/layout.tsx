import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HIDEWOOD // Atelier Master Control & Command',
  description: 'Confidential Kanpur Atelier Administrative Terminal',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[999999] bg-[#070707] text-white overflow-y-auto">
      {children}
    </div>
  );
}
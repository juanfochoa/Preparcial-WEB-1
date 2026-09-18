// ============================================================
// ROOT LAYOUT (Layout Raíz)
// ============================================================
//
// En Next.js (App Router), el archivo layout.tsx es OBLIGATORIO
// en la carpeta app/. Es el "esqueleto" que envuelve a TODAS
// las páginas de la aplicación.
//
//   El layout NO cambia, solo cambia el children.
//
// Este archivo NO necesita "use client" porque él mismo
// no usa hooks ni eventos.

import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";

// Metadata es una feature de Next.js para SEO (título, descripción)
export const metadata = {
  title: "ShopHub - Tu tienda en línea",
  description: "Plataforma e-commerce construida con Next.js y React",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/*
          CartProvider envuelve TODO.
          Cualquier componente dentro de este Provider puede
          acceder al carrito usando useCart().
        */}
        <CartProvider>
          {/* Header aparece en TODAS las páginas */}
          <Header />

          {/* 
            main contiene el contenido de la página actual.
            Este {children} cambia según la ruta, pero el
            layout (Header + Provider) se mantiene.
          */}
          <main style={{ minHeight: "calc(100vh - 72px)", padding: "24px 32px" }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}

// ============================================================
// ROOT LAYOUT (Layout Raíz)
// ============================================================
//
// En Next.js (App Router), el archivo layout.tsx es OBLIGATORIO
// en la carpeta app/. Es el "esqueleto" que envuelve a TODAS
// las páginas de la aplicación.
//
// ¿Por qué es importante para este proyecto?
//   - Aquí colocamos el CartProvider para que el contexto del
//     carrito esté disponible en TODAS las rutas.
//   - Aquí colocamos el Header para que sea PERSISTENTE
//     (no se desmonta ni se vuelve a renderizar al navegar).
//
// ¿Qué es {children}?
//   Es el contenido de la página actual. Cuando el usuario
//   está en "/", children es el contenido de page.tsx.
//   Cuando está en "/productos/3", children es el contenido
//   de productos/[id]/page.tsx.
//   El layout NO cambia, solo cambia el children.
//
// NOTA: Este archivo NO necesita "use client" porque él mismo
// no usa hooks ni eventos. Importa componentes de cliente
// (CartProvider, Header), y Next.js se encarga de renderizarlos
// correctamente en el navegador.
// ============================================================

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

// ============================================================
// COMPONENTE HEADER (Barra Superior Persistente)
// ============================================================
//
// Este componente aparece en TODAS las páginas porque lo
// colocamos en el layout.tsx (el layout raíz).
//
// Es un componente de CLIENTE ("use client") porque:
//   - Usa useCart(), que internamente usa useContext (un hook)
//   - Los hooks solo funcionan en componentes de cliente
//
// ¿Qué hace?
//   - Muestra el nombre de la tienda con un enlace a "/"
//   - Muestra un contador reactivo con la cantidad de productos
//     en el carrito, que se actualiza en tiempo real
// ============================================================

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  // Consumimos el contexto del carrito para obtener el array "cart"
  const { cart } = useCart();

  // Calculamos la cantidad total de productos en el carrito.
  // .reduce() recorre cada item y va sumando las cantidades.
  // El 0 al final es el valor inicial del acumulador.
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header style={styles.header}>
      {/* 
        Link es el componente de Next.js para navegación SPA.
        A diferencia de <a>, NO recarga la página completa.
        Solo cambia el contenido que necesita cambiar.
      */}
      <Link href="/" style={styles.logo}>
        ShopHub
      </Link>

      <Link href="/carrito" style={styles.cartIndicator}>
        🛒
        <span style={styles.cartCount}>
          {totalItems}
        </span>
      </Link>
    </header>
  );
}

// Estilos en línea para mantener todo en un solo archivo.
const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#1a1a2e",
    color: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#e94560",
    textDecoration: "none",
  },
  cartIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "18px",
    textDecoration: "none",
    color: "#ffffff",
  },
  cartCount: {
    backgroundColor: "#e94560",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

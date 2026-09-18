"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, getTotal } = useCart();

  // Si el carrito está vacío, mostramos un mensaje y un link de regreso
  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h1 style={styles.heading}>Tu carrito</h1>
        <p style={styles.emptyText}>No tienes productos en el carrito.</p>
        <Link href="/" style={styles.backLink}>
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Tu carrito</h1>

      {/* Recorremos cada item del carrito */}
      {cart.map((item) => (
        <div key={item.id} style={styles.item}>
          {/* Imagen pequeña */}
          <img
            src={item.thumbnail}
            alt={item.title}
            style={styles.itemImage}
          />

          {/* Info del producto */}
          <div style={styles.itemInfo}>
            <h3 style={styles.itemTitle}>{item.title}</h3>
            <p style={styles.itemMeta}>
              ${item.price.toFixed(2)} × {item.quantity}
            </p>
            <p style={styles.itemSubtotal}>
              Subtotal: ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          {/* Botón eliminar — llama a removeFromCart con el id */}
          <button
            onClick={() => removeFromCart(item.id)}
            style={styles.removeButton}
          >
            Eliminar
          </button>
        </div>
      ))}

      {/* Pie del carrito: total y acciones */}
      <div style={styles.footer}>
        <p style={styles.total}>
          Total: ${getTotal().toFixed(2)}
        </p>

        <div style={styles.footerActions}>
          <button
            onClick={clearCart}
            style={styles.clearButton}
          >
            Vaciar carrito
          </button>

          <Link href="/" style={styles.continueLink}>
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "8px 0 40px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "24px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px 24px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
  itemInfo: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  itemTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a2e",
    margin: 0,
  },
  itemMeta: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
  },
  itemSubtotal: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
  },
  removeButton: {
    padding: "8px 16px",
    backgroundColor: "#fff0f3",
    color: "#e94560",
    border: "1px solid #e94560",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    flexShrink: 0,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    padding: "24px 28px",
    marginTop: "20px",
  },
  total: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#ffffff",
    margin: 0,
  },
  footerActions: {
    display: "flex",
    gap: "12px",
  },
  clearButton: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
  continueLink: {
    padding: "10px 20px",
    backgroundColor: "#e94560",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 700,
  },
  // Pantalla vacía centrada
  emptyContainer: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#888",
  },
  emptyText: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  backLink: {
    display: "inline-block",
    color: "#e94560",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "14px",
  },
};

// ============================================================
// COMPONENTE ProductCard (Tarjeta de Producto)
// ============================================================
//
// Es un componente de CLIENTE porque:
//   - Usa useCart() para acceder a la función addToCart
//   - Tiene un onClick (evento del navegador)
//
// PROPS:
//   Este componente recibe datos del producto como props.
//   Los props son la forma en que un componente PADRE le pasa
//   información a un componente HIJO. El flujo es unidireccional:
//   siempre de padre → hijo, nunca al revés.
//
//   Para comunicar del hijo al padre se usan CALLBACKS
//   (funciones que el padre le pasa al hijo como props).
//   En este caso, usamos el Context directamente en vez de
//   callbacks, pero el principio es el mismo.
// ============================================================

"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

// Definimos las props que este componente espera recibir.
// Usamos la interface Product que ya definimos en types/
interface ProductCardProps {
  product: Product;
}

// Destructuramos las props directamente en el parámetro.
// En vez de (props) y luego props.product, escribimos ({ product }).
export default function ProductCard({ product }: ProductCardProps) {
  // Sacamos la función addToCart del contexto global
  const { addToCart } = useCart();

  // Función que se ejecuta al hacer click en "Agregar al carrito"
  const handleAddToCart = () => {
    // Creamos un CartItem a partir de los datos del Product
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1, // siempre agregamos 1 unidad
    });
  };

  return (
    <div style={styles.card}>
      {/* Imagen del producto */}
      <img
        src={product.thumbnail}
        alt={product.title}
        style={styles.image}
      />

      <div style={styles.info}>
        {/* Categoría como etiqueta */}
        <span style={styles.category}>{product.category}</span>

        {/* Nombre del producto */}
        <h3 style={styles.title}>{product.title}</h3>

        {/* Precio y stock */}
        <p style={styles.price}>${product.price.toFixed(2)}</p>
        <p style={styles.stock}>Stock: {product.stock} unidades</p>

        {/* Acciones: ver detalle y agregar al carrito */}
        <div style={styles.actions}>
          {/*
            Link para ir a la vista de detalle.
            La ruta /productos/[id] es una ruta DINÁMICA:
            Next.js reemplaza [id] por el valor real.
          */}
          <Link href={`/productos/${product.id}`} style={styles.detailLink}>
            Ver detalle
          </Link>

          <button onClick={handleAddToCart} style={styles.addButton}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

// TODO: Puedes mejorar estos estilos o migrar a CSS Modules / Tailwind
const styles: Record<string, React.CSSProperties> = {
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    transition: "box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  info: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flexGrow: 1,
  },
  category: {
    fontSize: "12px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    margin: 0,
    color: "#1a1a2e",
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#e94560",
    margin: 0,
  },
  stock: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "auto",
    paddingTop: "12px",
  },
  detailLink: {
    padding: "8px 12px",
    border: "1px solid #1a1a2e",
    borderRadius: "6px",
    color: "#1a1a2e",
    textDecoration: "none",
    fontSize: "13px",
    textAlign: "center",
    flexGrow: 1,
  },
  addButton: {
    padding: "8px 12px",
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    flexGrow: 1,
  },
};

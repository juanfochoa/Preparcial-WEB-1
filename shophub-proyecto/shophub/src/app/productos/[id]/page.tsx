// ============================================================
// PÁGINA DE DETALLE DE PRODUCTO (/productos/[id])
// ============================================================
//
// Esta es una RUTA DINÁMICA de Next.js.
// El [id] en el nombre de la carpeta significa que esta página
// se renderiza para cualquier URL tipo /productos/1, /productos/5, etc.
// Next.js extrae el valor del "id" y lo pasa como parámetro.
//
// Es un componente de CLIENTE porque:
//   - Usa useState y useEffect (hooks)
//   - Usa useCart() (contexto, que es un hook)
//   - Tiene eventos onClick
//
// ¿Cómo se obtiene el id de la URL?
//   Next.js pasa un objeto "params" como prop a las páginas.
//   En App Router, params es una Promise que debemos await.
//   Para rutas como /productos/[id], params contiene { id: "3" }.
// ============================================================

"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ProductDetail } from "@/types/product";
import { useCart } from "@/context/CartContext";

// Tipamos los params que Next.js le pasa a esta página
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  // use() es un hook de React 19 que permite "desenvolver" una Promise.
  // En versiones anteriores se usaba useParams() de next/navigation.
  const { id } = use(params);

  // Estados locales del componente
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtenemos addToCart del contexto global
  const { addToCart } = useCart();

  // Fetch del producto individual cuando el componente se monta
  // o cuando el id cambia (ej: navegas de /productos/1 a /productos/2)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Usamos el id de la URL para construir la URL de la API
        const response = await fetch(`https://dummyjson.com/products/${id}`);

        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }

        const data: ProductDetail = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // <-- Se ejecuta cada vez que el id cambie

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    });
  };

  // --- Renderizado condicional ---

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando producto...</p>;
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p style={{ color: "red" }}>Error: {error || "Producto no encontrado"}</p>
        <Link href="/" style={styles.backLink}>
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Botón para regresar al catálogo */}
      <Link href="/" style={styles.backLink}>
        ← Volver al catálogo
      </Link>

      <div style={styles.content}>
        {/* Imagen principal del producto */}
        <div style={styles.imageContainer}>
          <img
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            style={styles.image}
          />
        </div>

        {/* Panel de información */}
        <div style={styles.details}>
          <span style={styles.category}>{product.category}</span>

          <h1 style={styles.title}>{product.title}</h1>

          {/* TODO: Muestra la marca (brand) del producto aquí */}
          {/* Pista: product.brand */}

          <p style={styles.price}>${product.price.toFixed(2)}</p>

          <p style={styles.stock}>
            {product.stock > 0
              ? `✅ En stock (${product.stock} disponibles)`
              : "❌ Sin stock"}
          </p>

          <p style={styles.description}>{product.description}</p>

          <button
            onClick={handleAddToCart}
            style={styles.addButton}
            disabled={product.stock === 0}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

// TODO: Puedes mejorar estos estilos para que se vea más profesional
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-block",
    color: "#1a1a2e",
    textDecoration: "none",
    marginBottom: "24px",
    fontSize: "14px",
    fontWeight: 500,
  },
  content: {
    display: "flex",
    gap: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    flexWrap: "wrap",
  },
  imageContainer: {
    flex: "1 1 300px",
    minWidth: "280px",
  },
  image: {
    width: "100%",
    borderRadius: "8px",
    objectFit: "cover",
  },
  details: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  category: {
    fontSize: "12px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
  },
  price: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#e94560",
    margin: 0,
  },
  stock: {
    fontSize: "14px",
    color: "#555",
    margin: 0,
  },
  description: {
    fontSize: "15px",
    color: "#444",
    lineHeight: 1.7,
  },
  addButton: {
    padding: "14px 24px",
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    marginTop: "12px",
  },
};

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

  // Fetch del producto individual cuando el componente se monta o cuando el id cambia
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

          <p style={styles.brand}>{product.brand}</p>
          <hr style={styles.divider} />
                    
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "8px 0 40px",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#e94560",
    textDecoration: "none",
    marginBottom: "28px",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.3px",
  },

  content: {
    display: "flex",
    gap: "48px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    flexWrap: "wrap",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  imageContainer: {
    flex: "1 1 320px",
    minWidth: "280px",
  },
  
  image: {
    width: "100%",
    borderRadius: "12px",
    objectFit: "cover",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  },
  details: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  category: {
    display: "inline-block",
    fontSize: "11px",
    color: "#e94560",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: 700,
    backgroundColor: "#fff0f3",
    padding: "4px 10px",
    borderRadius: "20px",
    width: "fit-content",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
    lineHeight: 1.3,
  },

  brand: {
    fontSize: "14px",
    color: "#888",
    margin: 0,
    fontWeight: 500,
  },

  divider: {
    border: "none",
    borderTop: "1px solid #f0f0f0",
    margin: "4px 0",
  },
  price: {
    fontSize: "34px",
    fontWeight: 800,
    color: "#e94560",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  stock: {
    fontSize: "13px",
    color: "#555",
    margin: 0,
    fontWeight: 500,
  },
  description: {
    fontSize: "14px",
    color: "#666",
    lineHeight: 1.8,
    margin: 0,
  },
  addButton: {
    padding: "14px 28px",
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "8px",
    letterSpacing: "0.3px",
  },
};

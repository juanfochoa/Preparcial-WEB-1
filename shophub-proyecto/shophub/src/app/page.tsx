// ============================================================
// PÁGINA DEL CATÁLOGO PRINCIPAL (/)
// ============================================================
//
// Esta es la página de inicio. Su trabajo es:
//   1. Hacer un fetch a la API de DummyJSON para obtener productos
//   2. Mostrar esos productos en un grid de tarjetas
//
// Es un componente de CLIENTE ("use client") porque:
//   - Usa useState para guardar los productos en el estado
//   - Usa useEffect para hacer el fetch cuando el componente
//     se monta (aparece en pantalla por primera vez)
//
// ¿Qué es useEffect?
//   Es un hook que ejecuta código como "efecto secundario":
//   cosas que no son parte del renderizado, como fetch a APIs,
//   subscripciones, timers, etc.
//   El segundo parámetro (el array []) controla CUÁNDO se ejecuta:
//     - [] vacío = solo al montar el componente (1 vez)
//     - [variable] = cada vez que esa variable cambie
//     - sin array = en CADA renderizado (casi nunca quieres esto)
//
// ¿Qué es useState?
//   Es un hook que le da "memoria" a un componente.
//   Retorna [valor, funcionParaCambiarValor].
//   Cada vez que llamamos la función, React re-renderiza el
//   componente con el nuevo valor.
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { Product, ProductsApiResponse } from "@/types/product";
import ProductCard from "@/components/ProductCard";

// URL del endpoint que nos da el listado de productos
const API_URL =
  "https://dummyjson.com/products?limit=8&select=id,title,price,category,thumbnail,stock";

export default function CatalogPage() {
  // Estado para guardar los productos que llegan de la API
  const [products, setProducts] = useState<Product[]>([]);

  // Estado para saber si estamos cargando datos
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para guardar errores si el fetch falla
  const [error, setError] = useState<string | null>(null);

  // useEffect se ejecuta DESPUÉS del primer renderizado.
  // Aquí hacemos la petición HTTP a la API.
  useEffect(() => {
    // Definimos una función async dentro del useEffect
    // porque useEffect NO puede ser async directamente.
    const fetchProducts = async () => {
      try {
        // fetch() hace la petición HTTP GET a la URL
        const response = await fetch(API_URL);

        // Si la respuesta no es OK (200), lanzamos un error
        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }

        // Convertimos la respuesta a JSON y le decimos a TypeScript
        // que tiene la forma de ProductsApiResponse
        const data: ProductsApiResponse = await response.json();

        // Guardamos los productos en el estado
        setProducts(data.products);
      } catch (err) {
        // Si algo sale mal, guardamos el mensaje de error
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        // Pase lo que pase (éxito o error), dejamos de cargar
        setLoading(false);
      }
    };

    // Llamamos la función que acabamos de definir
    fetchProducts();
  }, []); // <-- Array vacío: solo se ejecuta 1 vez al montar

  // --- Renderizado condicional ---
  // Mostramos diferentes cosas según el estado actual

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando productos...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red", marginTop: "40px" }}>Error: {error}</p>;
  }

  return (
    <div>
      <h1 style={styles.heading}>Catálogo de Productos</h1>

      {/* 
        Grid de tarjetas. Usamos CSS Grid para organizar las cards.
        .map() recorre el array de productos y por cada uno
        retorna un componente ProductCard.
        
        IMPORTANTE: el prop "key" es obligatorio cuando renderizamos
        listas. React lo usa para identificar qué elementos cambiaron.
        Debe ser un valor ÚNICO por elemento (aquí el id).
      */}
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* TODO: Podrías agregar paginación o un botón "cargar más" */}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
};

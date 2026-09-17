// ============================================================
// TIPOS DE DATOS (Interfaces de TypeScript)
// ============================================================
// En TypeScript, una "interface" define la FORMA de un objeto.
// Es como un contrato: cualquier objeto que diga ser de este
// tipo DEBE tener exactamente estas propiedades con estos tipos.
//
// ¿Por qué lo hacemos?
// Si en algún lado escribes producto.titulo en vez de producto.title,
// TypeScript te avisa del error ANTES de ejecutar el código.
// ============================================================

// Esta interface describe un producto tal como llega de la API
// cuando pedimos el LISTADO (endpoint con select=id,title,price,...)
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string; // URL de la imagen pequeña
  stock: number;
}

// Esta interface describe un producto cuando pedimos su DETALLE
// El endpoint /products/{id} devuelve TODOS los campos
export interface ProductDetail {
  id: number;
  title: string;
  description: string; // el detalle SÍ trae descripción
  price: number;
  category: string;
  brand: string;
  stock: number;
  thumbnail: string;
  images: string[]; // array de URLs de imágenes grandes
}

// Esta interface describe un item dentro del carrito de compras.
// Hereda los datos del producto y le agrega la cantidad.
export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number; // cuántas unidades de este producto hay en el carrito
}

// Esta interface describe la FORMA de la respuesta de la API
// cuando pedimos el listado de productos.
// La API no devuelve solo un array, sino un objeto con metadata.
export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

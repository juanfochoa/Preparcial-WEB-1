// ============================================================
// CONTEXTO DEL CARRITO (React Context API)
// ============================================================
//
// ¿Qué es un Context?
// Es un mecanismo de React para compartir datos entre componentes
// SIN tener que pasarlos como props manualmente nivel por nivel.
// Esto evita el "Prop Drilling" (pasar props a través de muchos
// componentes intermedios que no los necesitan).
//
// Se compone de dos partes:
//   1. PROVIDER: el componente que GUARDA y PROVEE los datos.
//   2. CONSUMER (useContext): el hook que CONSUME esos datos
//      desde cualquier componente hijo.
//
// ¿Por qué "use client"?
// En Next.js App Router, los componentes son Server Components
// por defecto. Pero un Context usa useState y createContext,
// que son features del navegador (del cliente). Por eso
// necesitamos marcar este archivo como componente de cliente.
// ============================================================

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/types/product";

// ------------------------------------------------------------
// PASO 1: Definir la FORMA del contexto
// ------------------------------------------------------------
// Esta interface dice QUÉ valores y funciones estarán
// disponibles para cualquier componente que consuma el contexto.
interface CartContextType {
  cart: CartItem[]; // El array con los productos del carrito
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

// ------------------------------------------------------------
// PASO 2: Crear el contexto
// ------------------------------------------------------------
// createContext crea el objeto de contexto. Le pasamos null como
// valor por defecto porque el valor real lo dará el Provider.
const CartContext = createContext<CartContextType | null>(null);

// ------------------------------------------------------------
// PASO 3: Crear el Provider (el componente que guarda el estado)
// ------------------------------------------------------------
// Este componente envuelve a toda la app (o parte de ella).
// Sus "children" son los componentes que podrán acceder al contexto.
export function CartProvider({ children }: { children: ReactNode }) {
  // useState para guardar el array del carrito.
  // Arranca como un array vacío.
  const [cart, setCart] = useState<CartItem[]>([]);

  // Función para agregar un producto al carrito.
  // IMPORTANTE: nunca mutamos el array directamente (cart.push(...))
  // porque React NO detectaría el cambio. Siempre creamos un
  // array NUEVO usando el spread operator [...].
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Buscamos si el producto ya existe en el carrito
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        // Si ya existe, creamos un NUEVO array donde solo
        // actualizamos la cantidad del producto que coincide.
        // .map() retorna un nuevo array (inmutabilidad).
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Si no existe, lo agregamos al final con cantidad 1.
        // [...prevCart, nuevoItem] crea un nuevo array con
        // todo lo anterior + el nuevo elemento.
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
  // .filter() recorre cada item del carrito y lo INCLUYE en el
  // nuevo array SOLO si la condición retorna true.
  // Aquí decimos: "quédate con todos los items cuyo id sea DIFERENTE al que quiero borrar".
  setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };


  const clearCart = () => {
  // Setea el estado a un array vacío.
  // React detecta que el valor cambió y re-renderiza.
  setCart([]);
  };

  
  const getTotal = (): number => {
  // .reduce() toma dos argumentos:
  //   1. Una función con (acumulador, elementoActual)
  //   2. El valor inicial del acumulador (0 en este caso)
  //
  // En cada iteración:
  //   acumulador = acumulador + (precio * cantidad)
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // El Provider envuelve a sus children y les pasa los valores
  // a través de la prop "value".
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ------------------------------------------------------------
// PASO 4: Crear un hook personalizado para CONSUMIR el contexto
// ------------------------------------------------------------
// En vez de hacer useContext(CartContext) en cada componente,
// creamos este hook que además valida que el contexto exista.
export function useCart() {
  const context = useContext(CartContext);

  // Si alguien usa useCart() fuera del Provider, lanzamos error.
  // Esto ayuda a detectar errores de configuración rápido.
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }

  return context;
}

export interface CartItem {
    descripcion: string; // Descripción del producto
    id: number;          // ID del producto
    img: string;         // URL de la imagen
    nombre: string;      // Nombre del producto
    precio: number;      // Precio del producto
    quantity: number;    // Cantidad en el carrito
    stock: number;       // Stock disponible
    subcategoria_id: number; // ID de la subcategoría
  }
  
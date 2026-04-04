import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export function getCart(): CartItem[] {
  const stored = localStorage.getItem("ge-cart");
  return stored ? JSON.parse(stored) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("ge-cart", JSON.stringify(cart));
}

export function addToCart(product: Product) {
  const cart = getCart();
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }
  saveCart(cart);
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((item) => item.product.id !== productId);
  saveCart(cart);
  window.dispatchEvent(new Event("cart-updated"));
}

export function updateQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const item = cart.find((i) => i.product.id === productId);
  if (item) {
    item.quantity = Math.max(0, quantity);
    if (item.quantity === 0) {
      saveCart(cart.filter((i) => i.product.id !== productId));
    } else {
      saveCart(cart);
    }
  }
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function getWhatsAppCheckoutLink(cart: CartItem[]): string {
  const lines = cart.map(
    (item) => `• ${item.product.name} x${item.quantity} - ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}`
  );
  const total = getCartTotal(cart);
  const message = `Hi! I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ₹${total.toLocaleString("en-IN")}\n\nPlease confirm availability.`;
  return `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
}

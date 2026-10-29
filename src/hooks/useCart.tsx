import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { Cart, CartItem, Product } from '../types';
import { storage } from '../utils';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (product: Product, variantId?: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dokkan_cart';

function createEmptyCart(): Cart {
  return {
    id: `cart_${Date.now()}`,
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    currency: 'SAR',
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };
}

function calculateCartTotals(cart: Cart, shippingFee: number = 0, taxRate: number = 0): Cart {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cart.discount || 0;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;
  const shipping = subtotal > (shippingFee ? 0 : 999999) ? 0 : shippingFee; // Free shipping logic would be configurable
  const total = subtotal + shipping + tax - discount;

  return {
    ...cart,
    subtotal,
    shipping,
    tax,
    total,
    updatedAt: new Date(),
  };
}

export function CartProvider({ children, initialShipping = 0, initialTaxRate = 0 }: { children: React.ReactNode; initialShipping?: number; initialTaxRate?: number }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get<Cart>(CART_STORAGE_KEY);
    if (savedCart) {
      // Convert date strings back to Date objects
      const cartWithDates = {
        ...savedCart,
        createdAt: new Date(savedCart.createdAt),
        updatedAt: new Date(savedCart.updatedAt),
        expiresAt: savedCart.expiresAt ? new Date(savedCart.expiresAt) : undefined,
        items: savedCart.items.map(item => ({
          ...item,
        })),
      };
      setCart(calculateCartTotals(cartWithDates, initialShipping, initialTaxRate));
    } else {
      setCart(calculateCartTotals(createEmptyCart(), initialShipping, initialTaxRate));
    }
    setLoading(false);
  }, [initialShipping, initialTaxRate]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart && !loading) {
      storage.set(CART_STORAGE_KEY, cart);
    }
  }, [cart, loading]);

  const addItem = useCallback(async (product: Product, variantId?: string, quantity = 1) => {
    setCart(prevCart => {
      if (!prevCart) return calculateCartTotals(createEmptyCart(), initialShipping, initialTaxRate);

      // Check if item already exists
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.id && item.variantId === variantId
      );

      let updatedItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxQuantity || 99) }
            : item
        );
      } else {
        // Add new item
        const price = variantId
          ? product.variants.find(v => v.id === variantId)?.price || product.price.amount
          : product.price.amount;

        const newItem: CartItem = {
          id: `item_${Date.now()}`,
          productId: product.id,
          variantId,
          quantity: Math.min(quantity, 99),
          price,
          name: product.name,
          image: product.images[0]?.url || '',
          variantOptions: variantId
            ? product.variants.find(v => v.id === variantId)?.options
            : undefined,
          maxQuantity: variantId
            ? product.variants.find(v => v.id === variantId)?.inventory.available
            : product.inventory.available,
        };
        updatedItems = [...prevCart.items, newItem];
      }

      return calculateCartTotals({ ...prevCart, items: updatedItems }, initialShipping, initialTaxRate);
    });
  }, [initialShipping, initialTaxRate]);

  const removeItem = useCallback(async (itemId: string) => {
    setCart(prevCart => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return calculateCartTotals({ ...prevCart, items: updatedItems }, initialShipping, initialTaxRate);
    });
  }, [initialShipping, initialTaxRate]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 99) }
          : item
      );
      return calculateCartTotals({ ...prevCart, items: updatedItems }, initialShipping, initialTaxRate);
    });
  }, [initialShipping, initialTaxRate]);

  const clearCart = useCallback(async () => {
    setCart(calculateCartTotals(createEmptyCart(), initialShipping, initialTaxRate));
  }, [initialShipping, initialTaxRate]);

  const applyCoupon = useCallback(async (code: string) => {
    // In a real app, this would validate the coupon with the backend
    // For now, we'll just store the code
    setCart(prevCart => {
      if (!prevCart) return prevCart;
      return calculateCartTotals({ ...prevCart, couponCode: code }, initialShipping, initialTaxRate);
    });
  }, [initialShipping, initialTaxRate]);

  const removeCoupon = useCallback(async () => {
    setCart(prevCart => {
      if (!prevCart) return prevCart;
      return calculateCartTotals({ ...prevCart, couponCode: undefined, discount: 0 }, initialShipping, initialTaxRate);
    });
  }, [initialShipping, initialTaxRate]);

  const getItemCount = useCallback(() => {
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart]);

  const getSubtotal = useCallback(() => {
    return cart?.subtotal || 0;
  }, [cart]);

  const value: CartContextType = {
    cart,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getItemCount,
    getSubtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
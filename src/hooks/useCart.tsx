import { S_IFCHR } from 'constants';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const [products, setProducts] = useState<Product[]>([])
  const [stock, setStock] = useState<Stock[]>([])

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get<Product[]>('/products')
      setProducts(data)
    }
    loadProducts();
  }, []);

  useEffect(() => {
    async function loadStock() {
      const { data } = await api.get<Stock[]>('/stock')
      setStock(data)
    }
    loadStock();
  }, [])

  const addProduct = async (productId: number) => {
    try {
      products.map(product => {
        if(product.id === productId) {
          product.amount = product.amount + 1
          setCart([ ...cart, product])
        }
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        return cart
      })
    } catch {
      console.log('error addProduct catch')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newProducts = cart.filter(product => product.id !== productId);
      setCart(newProducts)
    } catch {
      console.log('error removeProduct catch')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      cart.map(product => {
        if(product.id === productId) {
          product.amount = amount
          setCart([ ...cart, product])
        }
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        return cart
      })
    } catch {
      console.log('updateProductAmount Error')
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);
  return context;
}

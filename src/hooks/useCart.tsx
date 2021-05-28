// localStorage.setItem('@RocketShoes:cart', cart)
// const storagedCart = localStorage.getItem('@RocketShoes:cart');
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
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get('/products')
      setProducts(data)
    }
    loadProducts();
  }, []);

  const addProduct = async (productId: number) => {
    try {
      products.map(product => {
        return setCart([ ...cart, product[productId]])
      })
    } catch {
      // TODO
      console.log('error addProduct catch')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      products.map(product => {
        console.log(productId)
        return setCart([ ...cart])
      })
    } catch {
      // TODO
      console.log('error removeProduct catch')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
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

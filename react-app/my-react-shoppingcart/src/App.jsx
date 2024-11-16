import React, { useState } from 'react';
import AddProductForm from './AddProductForm';
import CartList from './CartList';

const App = () => {
  const [cart, setCart] = useState([]);
  
  // 計算總金額
  const totalAmount = cart.reduce((total, product) => total + product.price, 0);

  // 新增商品
  const addProduct = (name, price) => {
    setCart([...cart, { id: Date.now(), name, price }]);
  };

  // 刪除商品
  const deleteProduct = (id) => {
    setCart(cart.filter((product) => product.id !== id));
  };

  // 更新商品
  const updateProduct = (id, newName, newPrice) => {
    setCart(
      cart.map((product) =>
        product.id === id ? { ...product, name: newName, price: newPrice } : product
      )
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>簡易購物車</h1>
      <AddProductForm onAddProduct={addProduct} />
      <CartList
        cart={cart}
        onDeleteProduct={deleteProduct}
        onUpdateProduct={updateProduct}
      />
      <h3>總金額: ${totalAmount.toFixed(2)}</h3>
    </div>
  );
};

export default App;


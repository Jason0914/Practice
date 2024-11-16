import React, { useState } from 'react';

const AddProductForm = ({ onAddProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (name.trim() && price > 0) {
      onAddProduct(name, parseFloat(price));
      setName('');
      setPrice('');
    } else {
      alert('請輸入正確的商品名稱和價格');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="商品名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input
        type="number"
        placeholder="價格"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleAdd}>新增商品</button>
    </div>
  );
};

export default AddProductForm;


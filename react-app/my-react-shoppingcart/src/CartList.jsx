import React, { useState } from 'react';

const CartList = ({ cart, onDeleteProduct, onUpdateProduct }) => {
  const [editableId, setEditableId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const handleEdit = (product) => {
    setEditableId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const handleSave = (id) => {
    if (editName.trim() && editPrice > 0) {
      onUpdateProduct(id, editName, parseFloat(editPrice));
      setEditableId(null);
    } else {
      alert('請輸入正確的商品名稱和價格');
    }
  };

  return (
    <div>
      <h2>購物車內容</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {cart.map((product) => (
          <li key={product.id} style={{ marginBottom: '10px' }}>
            {editableId === product.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ marginRight: '10px' }}
                />
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  style={{ marginRight: '10px' }}
                />
                <button onClick={() => handleSave(product.id)}>保存</button>
                <button onClick={() => setEditableId(null)}>取消</button>
              </>
            ) : (
              <>
                <span
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                  onClick={() => handleEdit(product)}
                >
                  {product.name}
                </span>
                <span style={{ marginRight: '10px' }}>${product.price.toFixed(2)}</span>
                <button onClick={() => onDeleteProduct(product.id)}>刪除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartList;


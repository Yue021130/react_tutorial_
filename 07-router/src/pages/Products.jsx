import { NavLink } from 'react-router-dom';

// ============================================
// Products: 商品列表页
//
// 点击商品标题跳转到商品详情页 /products/:id
// ============================================

const PRODUCTS = [
  { id: 1, name: 'iPhone 15', price: 5999, category: '手机' },
  { id: 2, name: 'MacBook Pro', price: 12999, category: '电脑' },
  { id: 3, name: 'AirPods Pro', price: 1899, category: '耳机' },
];

function Products() {
  return (
    <div className="card">
      <h2>🛍️ 商品列表</h2>
      <div style={{ marginTop: '1rem' }}>
        {PRODUCTS.map(product => (
          <div
            key={product.id}
            style={{
              padding: '1rem',
              marginBottom: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
          >
            {/*  to={`/products/${product.id}`} 路径匹配路由页的path */}
            <NavLink
              to={`/products/${product.id}`}
              style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none' }}
            >
              {product.name}
            </NavLink>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {product.category} · ¥{product.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

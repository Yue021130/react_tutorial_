import { useParams, useNavigate } from 'react-router-dom';

// ============================================
// ProductDetail: 商品详情页
//
// 通过 useParams() 读取 URL 中的商品 id
// 例如访问 /products/2，params.id 就是 "2"
// ============================================

const PRODUCTS = [
  { id: 1, name: 'iPhone 15', price: 5999, category: '手机', desc: '最新款苹果手机' },
  { id: 2, name: 'MacBook Pro', price: 12999, category: '电脑', desc: '专业级笔记本电脑' },
  { id: 3, name: 'AirPods Pro', price: 1899, category: '耳机', desc: '主动降噪耳机' },
];

function ProductDetail() {
  // 在 ProductDetail 组件里可以用 useParams() 获取路由上的id这个值
  const { id } = useParams();      // 获取 URL 参数
  const navigate = useNavigate();  // 编程式导航

  // 根据 id 查找商品
  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return <div className="card" style={{ color: 'var(--danger)' }}>商品不存在</div>;
  }

  return (
    <div className="card">
      <h2>📦 {product.name}</h2>
      <p style={{ color: 'var(--muted)' }}>
        {product.category} · ¥{product.price}
      </p>
      <p style={{ marginTop: '1rem' }}>{product.desc}</p>
      <button
        className="btn"
        style={{ marginTop: '1rem' }}
        onClick={() => navigate('/products')}
      >
        ← 返回列表
      </button>
    </div>
  );
}

export default ProductDetail;

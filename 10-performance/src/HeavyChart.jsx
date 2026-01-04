import { memo } from 'react';

// 模拟重量级组件
function HeavyChart() {
  const data = Array.from({ length: 50 }, (_, i) => ({ x: i, y: Math.sin(i * 0.2) * 50 + 50 }));
  return (
    <div className="card" style={{ marginTop: '1rem', height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, justifyContent: 'center' }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: `${d.y}%`,
            background: 'var(--accent)',
            borderRadius: 4,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

export default memo(HeavyChart);

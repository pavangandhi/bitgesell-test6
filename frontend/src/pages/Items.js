import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import './Items.css';

const ITEM_HEIGHT = 50;
const LIMIT = 3;

function Items() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchItems = async () => {
      try {
        const params = new URLSearchParams({ q, page, limit: LIMIT });
        const res = await fetch(`http://localhost:3001/api/items?${params}`);
        const data = await res.json();
        if (isMounted) {
          setItems(data.items || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (isMounted) console.error('Fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchItems();
    return () => {
      isMounted = false;
    };
  }, [q, page]);

  const totalPages = Math.ceil(total / LIMIT);

  const Row = ({ index, style }) => {
    const item = items[index];
    return item ? (
      <div style={{ ...style, padding: '0 1rem' }} className="item-row">
        <Link to={`/items/${item.id}`} aria-label={`View details of ${item.name}`}>
          {item.name}
        </Link>
      </div>
    ) : null;
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search items..."
        aria-label="Search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(1);
        }}
        className="search-input"
      />

      {loading ? (
        <div className="skeleton-list">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <List
          height={300}
          itemCount={items.length}
          itemSize={ITEM_HEIGHT}
          width="100%"
        >
          {Row}
        </List>
      )}

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Items;

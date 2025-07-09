import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null); // Track error state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/items/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Item not found');
          } else {
            throw new Error('Failed to load item');
          }
        }

        const data = await res.json();
        if (isMounted) {
          setItem(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unknown error');
          setItem(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <div className="skeleton-row" style={{ width: '60%' }} />
        <div className="skeleton-row" style={{ width: '40%', marginTop: 12 }} />
        <div className="skeleton-row" style={{ width: '50%', marginTop: 12 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to items list</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;

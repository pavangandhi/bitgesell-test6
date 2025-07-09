import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav style={{ padding: 16, borderBottom: '1px solid #ddd', marginBottom: 24 }}>
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>
          🛍️ Item Explorer
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;
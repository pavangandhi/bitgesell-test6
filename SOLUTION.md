# 📘 SOLUTION.md

## 👨‍💻 Overview

This project is a fullstack Items Management app built using:

- **Frontend**: React + React Router + React Window
- **Backend**: Express.js + Node.js with a file-based JSON store
- **Testing**: Jest + Testing Library (frontend), Supertest + Jest (backend)

The solution addresses core functionality with clean architecture, handles edge cases, and considers performance and user experience improvements.

---

## ✅ Features Implemented

### 1. **Memory Leak Fix**
- In `Items.js`, `useEffect` is cleaned up properly using `isMounted` or `AbortController` to prevent setting state after unmount.

### 2. **Pagination & Server-Side Search**
- API `/api/items` supports:
  - `?q=`: full-text query on item name
  - `?page=` and `?limit=`: paginated response
- Backend response includes: `{ items: [], total: n }`
- Frontend pagination updates page and resets on query change.

### 3. **Performance Optimization**
- Integrated `react-window` for virtualization on the frontend.
- Even large datasets render efficiently with minimal DOM nodes.

### 4. **UI/UX Enhancements**
- Responsive layout with search box, loading state, and no-results messages.
- Accessible controls with clear navigation and keyboard usability.

---

## 🧪 Testing Strategy

### Backend
- Used Jest + Supertest to mock and verify:
  - GET, POST, and error scenarios
  - JSON parsing failures and read/write errors
- 100% coverage of routes and edge cases.

### Frontend
- Used Testing Library + Jest with `jest-fetch-mock`
- Covered:
  - Loading state
  - Search filtering
  - Pagination behavior
  - Item detail rendering

---

## 🧠 Design Choices & Trade-Offs

| Decision | Reason | Trade-Off |
|---------|--------|-----------|
| File-based data store (`items.json`) | Simplicity and quick setup | Not scalable for concurrent writes or large data |
| Server-side pagination | Reduces frontend memory usage | Requires query logic in backend |
| `react-window` for virtualization | Improves large list performance | Adds complexity to testing and layout control |
| Mocking `fetch` vs. MSW | Used `jest-fetch-mock` for simplicity | MSW is more realistic but heavier for small apps |

---

## 🧩 Possible Improvements

- Replace file storage with database (e.g. SQLite, MongoDB)
- Add optimistic UI updates for POST
- Improve accessibility (ARIA roles, keyboard nav)
- Use `AbortController` instead of `isMounted` for fetch cleanup

---

## 🚀 How to Run

### Backend
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

### Tests
\`\`\`bash
# Backend
npm test

# Frontend
cd frontend
npm test
\`\`\`
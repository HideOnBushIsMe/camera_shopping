# Camera Shopping - E-Commerce Web Application

A modern Camera E-Commerce Single Page Application (SPA) built with **React 19** and **Vite**, featuring full RESTful MockAPI integration, Role-Based Access Control (RBAC), and enterprise-grade **Cross-Tab Concurrency Management** using the `BroadcastChannel API`.

---

## 🚀 Key Engineering Highlights

### 1. Cross-Tab Concurrency & Session Management
* **Single Active Tab Enforcement (Handshake Guard):** Prevents concurrent usage of the same account across multiple browser tabs (e.g., when a user duplicates a tab or pastes an authenticated URL). A lightweight ping-pong handshake over `BroadcastChannel` checks whether the primary tab is active; if active, secondary tabs are blocked from hijacking the session.
* **Instant Stale Session Invalidation:** When a user logs out in any tab, all other open tabs immediately receive a broadcast signal, revoke credentials in real time, and display a session expiration notice—preventing unauthorized or stale operations.
* **Action-level Guards:** Mutation operations (Create, Update, Delete) perform strict runtime role checks before dispatching API calls to prevent stale DOM exploits.

### 2. Real-time Rating Engine (No Hardcoded Data)
* Real-world rating calculation: Computes actual star averages (e.g., `(5 + 4) / 2 = 4.5/5 stars`) based purely on real submissions. Displays `0/5 stars` when no reviews exist.
* Interactive rating dialog: Customer accounts can submit live ratings directly within the product detail view, synchronizing immediately to state, `localStorage`, and remote MockAPI.
* Admin rating restriction: Administrators are explicitly restricted from reviewing products to maintain rating integrity.

### 3. Role-Based Access Control (RBAC) & Authentication
* **Protected Routes:** `AdminRoute` guards administrative endpoints (`/detail`, `/create`, `/detail/:id`).
* **MockAPI User Management:** Full registration and login workflows connecting to remote MockAPI endpoints with Formik and Yup validation.
* **Auto-redirect flow:** Remembers product views so that logging in or registering immediately restores the user's workflow.

### 4. Shopping Cart & Checkout
* Powered by `CartContext` and `useReducer` with automatic `localStorage` synchronization.
* Formik + Yup checkout validation with comprehensive error handling and item clearing upon order completion.

---

## 🛠 Tech Stack

* **Core:** React 19, Vite 7
* **Routing:** React Router DOM v7
* **State & Concurrency:** Context API, `useReducer`, `BroadcastChannel API`
* **API Client:** Axios
* **Forms & Validation:** Formik, Yup
* **UI Components & Icons:** React-Bootstrap, Bootstrap 5, Material-UI (`@mui/material`), React Icons

---

## 🔑 Demo Accounts

You can test the application using pre-configured MockAPI accounts or register a new customer account:

| Role | Username / Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@system.com` | `admin1` | Access to `/detail`, CRUD camera inventory |
| **Customer** | `customer@system.com` | `customer1` | Browse, Add to Cart, Checkout, Submit Ratings |

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/HideOnBushIsMe/camera_shopping.git
cd camera_shopping
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (already pre-configured):
```env
VITE_API_URL="https://6a48ad2ba033dcb98d64c6a1.mockapi.io/cameras"
VITE_USERS_API_URL="https://6aead7a93d3dd3d37be7523b.mockapi.io/users"
```

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

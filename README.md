# Ecoyaan Checkout Flow - Frontend Assignment

This project is a simplified **Checkout Flow** inspired by the Ecoyaan platform. It demonstrates proficiency with React, Next.js Server-Side Rendering (SSR), robust state management using Zustand, and responsive form handling with React Hook Form.

## Deliverables

- **Live Demo**: [Insert Vercel/Netlify Link Here]
- **Repository**: (https://github.com/PranavNarkhede2004/Ecoyaan-Checkout.git)

## Tech Stack & Architecture

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (Modern, clean, responsive design)
- **State Management**: **Zustand** (Global state management for cart items and shipping details, persisting data across routes via local storage hydration).
- **Form Handling**: **React Hook Form** for performant and robust shipping address validation.
- **Backend / DB (MERN Stack ready)**: 
  - API Routes (`/api/cart` and `/api/checkout`) simulate the Node.js/Express backend.
  - **Mongoose / MongoDB** integration is set up in `src/lib/mongodb.ts`. 
  - **Graceful Fallback**: If a local MongoDB instance is not running on `localhost:27017`, the app gracefully falls back to local static mock data (`src/lib/mockData.ts`) without crashing. This ensures reviewers can test the app instantly.

## Features & Screens

1. **Cart / Order Summary (SSR)** (`/`)
   - Uses `getCartData` (fetching from MongoDB or Mock file) to pre-render cart items via Next.js Server Components.
   - Hydrates the client-side `CartView` to interactively update quantities and calculate subtotals using Zustand.
2. **Shipping Address** (`/shipping`)
   - Responsive form collecting user details.
   - Robust pattern validation (email regex, 10-digit phone, 6-digit PIN code).
3. **Payment / Confirmation** (`/confirmation`)
   - Summarizes the cart and the entered shipping address.
   - Simulates a secure payment processing delay, communicates with `/api/checkout`, and shows a polished success state upon completion.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- *(Optional)* MongoDB running locally for full MERN experience.

### Installation

1. Clone this repository.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To run the development server, simply execute:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Note:** The app will attempt to connect to MongoDB initially. If it fails, it will print a warning in the console and automatically seamlessly fallback to the provided mock JSON data. No extra configuration is required to test the UI flow!

---
*Built for the Ecoyaan Frontend Engineering Assignment.*

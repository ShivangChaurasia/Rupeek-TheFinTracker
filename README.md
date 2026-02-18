# Rupeek - Master Your Finances 🚀
---
> **Financial Freedom, Simplified.**
> Experience the future of personal finance with Rupeek. Smart tracking, custom salary cycles, and premium analytics designed for the modern earner.

<img src="./Rupeek-Frontend/src/assets/rupeek.png" width="100" />
Live Link: https://rupeekfinances.vercel.app 

## 🌟 Overview

**Rupeek** is a comprehensive personal finance application designed to help users take control of their financial life. Built with modern web technologies, it offers a seamless, secure, and aesthetically pleasing interface for tracking income, expenses, and wealth growing over time.

## ✨ Key Features

### 🔐 **Secure Authentication**
-   **Robust Sign-up/Login**: Powered by **Firebase Auth**.
-   **Google Sign-In**: One-click access for convenience.
-   **Interactive Onboarding**: Smooth welcome animations and countdown redirects.

### 📊 **Interactive Dashboard**
-   **Real-time Overview**: Instant view of Current Balance, Total Income, and Expenses.
-   **Visual Charts**: Dynamic bar and pie charts using **Recharts** to visualize spending habits.
-   **Recent Transactions**: Quick access to your latest financial activities.

### 📝 **Smart Transaction Management**
-   **Easy Entry**: Intuitive modal for adding Income or Expenses.
-   **Categorization**: Organize transactions by standard categories (Food, Rent, Salary, Freelance, etc.).
-   **Transaction History**: Complete log of all financial movements with search and filter capabilities.
-   **Data Export**: Export your financial history to **CSV** for external analysis.

### 📈 **Detailed Analytics**
-   **Expense Breakdown**: Deep dive into where your money goes with category-wise pie charts.
-   **Income Analysis**: Understand your revenue streams better.

### 🎨 **Premium UI/UX**
-   **Modern Design**: Built with **Tailwind CSS** using a custom "Outfit" font family.
-   **Dark/Light Mode**: Fully theme-aware interface with a persistent toggle.
-   **Glassmorphism**: Trendy, frosted-glass effects on Cards, Modals, and Navbar.
-   **Responsive Layout**: Optimized for Desktop, Tablet, and Mobile devices.
-   **Animations**: Engaging **Lottie animations** and smooth CSS transitions.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/) (Vite)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Animations**: [Lottie React](https://lottiefiles.com/)
-   **Backend / Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
-   **Routing**: [React Router](https://reactrouter.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ShivangChaurasia/Rupeek-TheFinTracker.git
    cd Rupeek-TheFinTracker/Rupeek-Frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Firebase config keys:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment

The project is optimized for deployment on **Vercel**.

1.  Build the project:
    ```bash
    npm run build
    ```
2.  Deploy using Vercel CLI or Dashboard (Don't forget to add environment variables in Vercel settings).

## 👤 Author

**Shivang Chaurasia**

-   [LinkedIn](https://www.linkedin.com/in/shivang-chaurasia-754232297/)
-   [GitHub](https://github.com/ShivangChaurasia)

---

© 2026 Rupeek. All rights reserved.

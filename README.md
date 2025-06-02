# 💰 Personal Finance Tracker

A comprehensive web application designed to help users take control of their personal finances through intuitive tracking, intelligent budgeting, and insightful data visualization.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 📊 **Transaction Management**
- **Add, Edit & Delete Transactions** - Complete CRUD operations for financial records
- **Smart Categorization** - Organize expenses into meaningful categories
- **Transaction History** - Detailed chronological view of all financial activities
- **Quick Entry Forms** - Streamlined input process with validation

### 📈 **Advanced Analytics & Visualization**
- **Monthly Expense Tracking** - Interactive bar charts showing spending trends over time
- **Category Breakdown** - Pie charts for visual spending distribution
- **Spending Pattern Analysis** - Identify trends and unusual spending behaviors
- **Historical Comparisons** - Month-over-month and year-over-year insights

### 💸 **Smart Budget Management**
- **Category-wise Budgeting** - Set individual budgets for different expense categories
- **Budget vs Actual Tracking** - Real-time comparison with visual indicators
- **Overspending Alerts** - Instant notifications when approaching or exceeding budgets
- **Budget Performance Metrics** - Track your budgeting success over time

### 🎯 **Intelligent Dashboard**
- **Financial Overview** - At-a-glance summary of your financial health
- **Top Expense Categories** - Identify your biggest spending areas
- **Recent Activity Feed** - Latest transactions and budget updates
- **Goal Tracking** - Monitor progress toward financial objectives

### 📱 **User Experience**
- **Fully Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Dark/Light Mode Support** - Customizable interface themes
- **Intuitive Navigation** - User-friendly interface with minimal learning curve
- **Real-time Updates** - Instant feedback and data synchronization

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router for optimal performance
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/UI** - High-quality, accessible component library
- **Recharts** - Powerful charting library for data visualization

### **Backend & Database**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT Authentication** - Secure user session management

### **Development & Deployment**
- **ESLint & Prettier** - Code quality and formatting
- **Vercel** - Optimized deployment platform
- **Git** - Version control and collaboration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaGangwar2674/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
finance-tracker/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── transactions/      # Transaction management
│   └── budget/           # Budget management
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/UI components
│   ├── charts/           # Chart components
│   └── forms/            # Form components
├── lib/                  # Utility functions
│   ├── mongodb.js        # Database connection
│   └── utils.js          # Helper functions
├── models/               # Mongoose schemas
├── public/               # Static assets
└── styles/               # Global styles
```

---

## 🎨 Key Components

### **Transaction Manager**
- Add new transactions with category selection
- Edit existing records with form validation
- Delete transactions with confirmation dialogs
- Bulk operations for multiple transactions

### **Budget Planner**
- Set monthly/annual budgets by category
- Visual progress bars showing budget utilization
- Automated alerts for budget thresholds
- Historical budget performance tracking

### **Analytics Dashboard**
- Interactive charts powered by Recharts
- Customizable date ranges and filters
- Export functionality for reports
- Trend analysis and predictions

---

## 🔧 Configuration

### **Database Schema**
The application uses MongoDB with the following main collections:
- `transactions` - Financial transaction records
- `budgets` - Budget configurations and limits
- `categories` - Expense and income categories
- `users` - User accounts and preferences

### **API Endpoints**
- `GET/POST /api/transactions` - Transaction CRUD operations
- `GET/POST /api/budgets` - Budget management
- `GET /api/analytics` - Dashboard data and insights
- `GET /api/categories` - Category management

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Support

If you encounter any issues or have questions:
- Create an [Issue](https://github.com/AdityaGangwar2674/finance-tracker/issues)
- Check the [Wiki](https://github.com/AdityaGangwar2674/finance-tracker/wiki) for documentation
- Contact: [your-email@example.com]

---

## 🎯 Roadmap

- [ ] **Mobile App** - React Native companion app
- [ ] **Bank Integration** - Connect with banking APIs
- [ ] **Investment Tracking** - Portfolio management features
- [ ] **AI Insights** - Smart spending recommendations
- [ ] **Multi-currency Support** - International currency handling
- [ ] **Team Budgets** - Shared family/team budgeting

---

## ⭐ Show Your Support

If this project helped you manage your finances better, please give it a ⭐ on GitHub!

---

**Built with ❤️ by [Aditya Gangwar](https://github.com/AdityaGangwar2674)**

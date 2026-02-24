import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import DealersPage from './pages/Dealers'
import CustomersPage from './pages/Customers'
import ConfirmQuotationPage from './pages/ConfirmQuotation'
import OrderVerificationPage from './pages/OrderVerification'
import { DrawingDept, CuttingDept, BendingDept, FabricationDept, QCDept, AccessoriesDept, PaintingDept, FinalQCDept, WrappingDept } from './pages/Production'
import QCPage from './pages/QC'
import FinalQCPage from './pages/FinalQC'
import BillingPage from './pages/Billing'
import DispatchPage from './pages/Dispatch'
import WarrantyPage from './pages/Warranty'
import './index.css'

type Page = 'dashboard' | 'confirm' | 'verify-order' | 'drawing' | 'dealers' | 'customers' | 'cutting' | 'bending' | 'fabrication' | 'qc' | 'qc-decision' | 'accessories' | 'painting' | 'finalqc' | 'finalqc-decision' | 'wrapping' | 'billing' | 'dispatch' | 'warranty'

// Add keyframe animation for spinner
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)

export default function App() {
  const { isAuthenticated, user } = useAuth()
  const [page, setPage] = useState<Page>('dashboard')

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setPage('dashboard')} />
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage />
      case 'confirm':
        return <ConfirmQuotationPage />
      case 'verify-order':
        return user?.role === 'order_taker' ? <OrderVerificationPage /> : null
      case 'drawing':
        return <DrawingDept />
      case 'dealers':
        return <DealersPage />
      case 'customers':
        return <CustomersPage />
      case 'cutting':
        return <CuttingDept />
      case 'bending':
        return <BendingDept />
      case 'fabrication':
        return <FabricationDept />
      case 'qc-decision':
        return <QCPage />
      case 'accessories':
        return <AccessoriesDept />
      case 'painting':
        return <PaintingDept />
      case 'finalqc-decision':
        return <FinalQCPage />
      case 'wrapping':
        return <WrappingDept />
      case 'billing':
        return <BillingPage />
      case 'dispatch':
        return <DispatchPage />
      case 'warranty':
        return <WarrantyPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <Layout currentPage={page} onPageChange={setPage}>
      {renderPage()}
    </Layout>
  )
}
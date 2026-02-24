// Use Vite's import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiCall(endpoint: string, method = 'GET', body?: Record<string, any>) {
  const token = localStorage.getItem('auth_token')
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' }
  }
  if (token) {
    opts.headers = { ...opts.headers, 'Authorization': `Bearer ${token}` }
  }
  if (body) opts.body = JSON.stringify(body)
  
  const res = await fetch(`${API_URL}${endpoint}`, opts)
  
  if (res.status === 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/'
    throw new Error('Unauthorized')
  }
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`API error: ${res.status} - ${error}`)
  }
  
  return res.json()
}

export const api = {
  health: () => apiCall('/health'),
  createQuotation: (payload: any) => apiCall('/quotations', 'POST', payload),
  getQuotation: (id: number) => apiCall(`/quotations/${id}`),
  sendConfirm: (id: number) => apiCall(`/quotations/${id}/send_confirm`, 'POST'),
  confirmByToken: (token: string) => apiCall(`/confirm/${token}`, 'POST'),
  convertToOrder: (qid: number) => apiCall(`/quotations/${qid}/convert`, 'POST'),
  verifyOrder: (oid: number, orderTaker: string = 'admin') => apiCall(`/orders/${oid}/verify`, 'POST', { order_taker: orderTaker }),
  createWorkOrder: (orderId: number) => apiCall('/workorders', 'POST', { order_id: orderId }),
  approveDealerWorkOrder: (wid: number) => apiCall(`/workorders/${wid}/approve-dealer`, 'POST'),
  approveCustomerWorkOrder: (wid: number) => apiCall(`/workorders/${wid}/approve-customer`, 'POST'),
  updateProductStatus: (pid: number, status: string) => apiCall(`/products/${pid}/status`, 'PATCH', { status }),
  approveDrawing: (pid: number) => apiCall(`/products/${pid}/approve-drawing`, 'POST'),
  lockDrawing: (pid: number) => apiCall(`/products/${pid}/lock-drawing`, 'POST'),
  transferToDept: (pid: number, nextDept: string) => apiCall(`/products/${pid}/transfer-dept`, 'POST', { next_dept: nextDept }),
  qcResult: (pid: number, result: string, notes: string = '') => apiCall(`/products/${pid}/qc-result`, 'POST', { result, notes }),
  finalQcResult: (pid: number, result: string, notes: string = '') => apiCall(`/products/${pid}/final-qc-result`, 'POST', { result, notes }),
  createInvoice: (orderId: number, amount: number) => apiCall(`/invoices/${orderId}`, 'POST', { amount }),
  createShipment: (orderId: number, address: string = '') => apiCall('/shipments', 'POST', { order_id: orderId, address }),
  sendDeliveryWhatsapp: (shipmentId: number) => apiCall(`/shipments/${shipmentId}/send-whatsapp`, 'POST'),
  submitWarranty: (payload: any) => apiCall('/warranty/submit', 'POST', payload),
}
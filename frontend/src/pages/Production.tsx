import React, { useState } from 'react'
import { api } from '../api'

const DepartmentPage = ({ dept, deptKey, showApproval = false, showQC = false }: { dept: string, deptKey?: string, showApproval?: boolean, showQC?: boolean }) => {
  const [products, setProducts] = useState<any[]>([])
  const [newProduct, setNewProduct] = useState('')
  const [msg, setMsg] = useState('')

  const addProduct = () => {
    if (newProduct) {
      setProducts([...products, { id: Date.now(), name: newProduct, status: 'In Progress', approved: false, locked: false }])
      setNewProduct('')
    }
  }

  const updateStatus = (id: number, status: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, status } : p))
  }

  const approveDrawing = async (id: number) => {
    try {
      await api.approveDrawing(id)
      setProducts(products.map(p => p.id === id ? { ...p, approved: true } : p))
      setMsg(`✅ Drawing ${id} approved`)
    } catch (err: any) {
      setMsg(`❌ Error: ${err.message}`)
    }
  }

  const lockDrawing = async (id: number) => {
    try {
      await api.lockDrawing(id)
      setProducts(products.map(p => p.id === id ? { ...p, locked: true } : p))
      setMsg(`✅ Drawing ${id} locked - no more edits allowed`)
    } catch (err: any) {
      setMsg(`❌ Error: ${err.message}`)
    }
  }

  const transferToDept = async (id: number, nextDept: string) => {
    try {
      await api.transferToDept(id, nextDept)
      setMsg(`✅ Product ${id} transferred to ${nextDept} department`)
    } catch (err: any) {
      setMsg(`❌ Error: ${err.message}`)
    }
  }

  const getNextDept = () => {
    const depts = ['drawing', 'cutting', 'bending', 'fabrication', 'qc', 'accessories', 'painting', 'final_qc', 'wrapping']
    const idx = depts.indexOf(deptKey || '')
    return idx !== -1 && idx < depts.length - 1 ? depts[idx + 1] : null
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{dept} Department</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newProduct}
          onChange={e => setNewProduct(e.target.value)}
          placeholder="Product name"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={addProduct} style={btnStyle}>Add Product</button>
      </div>

      {msg && <p style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '20px' }}>{msg}</p>}

      {products.length === 0 ? (
        <p>No products in this department yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={cellStyle}>Product</th>
              <th style={cellStyle}>Status</th>
              {showApproval && <th style={cellStyle}>Drawing</th>}
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={cellStyle}>{p.name}</td>
                <td style={cellStyle}>{p.status}</td>
                {showApproval && (
                  <td style={cellStyle}>
                    {!p.approved && <span style={{ color: 'orange' }}>⏳ Pending</span>}
                    {p.approved && !p.locked && <span style={{ color: 'green' }}>✓ Approved</span>}
                    {p.locked && <span style={{ color: 'darkgreen' }}>🔒 Locked</span>}
                  </td>
                )}
                <td style={cellStyle}>
                  {showApproval && !p.approved && (
                    <button onClick={() => approveDrawing(p.id)} style={btnSmallStyle}>Approve</button>
                  )}
                  {showApproval && p.approved && !p.locked && (
                    <button onClick={() => lockDrawing(p.id)} style={btnSmallStyle}>Lock Drawing</button>
                  )}
                  {p.status === 'In Progress' && (
                    <button onClick={() => updateStatus(p.id, 'Completed')} style={btnSmallStyle}>Mark Done</button>
                  )}
                  {p.status === 'Completed' && getNextDept() && (
                    <button onClick={() => transferToDept(p.id, getNextDept()!)} style={btnSmallStyle}>Transfer →</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export const DrawingDept = () => <DepartmentPage dept="Drawing" deptKey="drawing" showApproval={true} />
export const CuttingDept = () => <DepartmentPage dept="Cutting" deptKey="cutting" />
export const BendingDept = () => <DepartmentPage dept="Bending" deptKey="bending" />
export const FabricationDept = () => <DepartmentPage dept="Fabrication" deptKey="fabrication" />
export const QCDept = () => <DepartmentPage dept="Quality Check (QC)" deptKey="qc" showQC={true} />
export const AccessoriesDept = () => <DepartmentPage dept="Accessories Fitting" deptKey="accessories" />
export const PaintingDept = () => <DepartmentPage dept="Putty & Painting" deptKey="painting" />
export const FinalQCDept = () => <DepartmentPage dept="Final QC" deptKey="final_qc" showQC={true} />
export const WrappingDept = () => <DepartmentPage dept="Wrapping" deptKey="wrapping" />

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}

const btnSmallStyle: React.CSSProperties = {
  padding: '5px 10px',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
  marginRight: '5px'
}

const cellStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left',
  borderRight: '1px solid #ddd',
}

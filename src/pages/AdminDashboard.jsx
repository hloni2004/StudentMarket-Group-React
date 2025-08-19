import React, { useState } from "react";
import { FaUsers, FaBoxOpen, FaSignOutAlt, FaChartBar, FaDatabase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);
  const [studentsCount, setStudentsCount] = useState(null);
  const [productsCount, setProductsCount] = useState(null);
  const [loading, setLoading] = useState({
    students: false,
    products: false
  });
  const [error, setError] = useState({
    students: null,
    products: null
  });

  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    setError(prev => ({ ...prev, students: null }));

    try {
      const response = await fetch('http://localhost:8080/api/student/getAll');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const studentNames = data.map(student => 
        `${student.firstName} ${student.lastName}`
      );
      
      setStudents(studentNames);
      setStudentsCount(data.length);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(prev => ({ ...prev, students: error.message }));
      setStudents([]);
      setStudentsCount(0);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    setError(prev => ({ ...prev, products: null }));

    try {
      const response = await fetch('http://localhost:8080/api/product/getAllProducts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const productNames = data.map(product => product.productName);
      
      setProducts(productNames);
      setProductsCount(data.length);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(prev => ({ ...prev, products: error.message }));
      setProducts([]);
      setProductsCount(0);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div className="border-bottom bg-white shadow-sm">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center me-3" 
                   style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px' }}>
                <FaChartBar className="text-white" size={20} />
              </div>
              <div>
                <h5 className="mb-0 text-dark fw-semibold">Admin Dashboard</h5>
                <small className="text-muted">Student Trade Management</small>
              </div>
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={handleLogout}
              style={{ borderRadius: '8px' }}
            >
              <FaSignOutAlt className="me-2" size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        {/* Statistics Overview - Updated to 2 columns */}
        <div className="row g-3 mb-4">
          <div className="col-lg-6 col-md-6">
            <div className="card border-0 h-100" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="p-2 rounded" style={{ backgroundColor: '#eff6ff' }}>
                    <FaUsers className="text-primary" size={20} />
                  </div>
                  <div className="ms-3">
                    <h6 className="text-muted mb-0 small">Active Students</h6>
                    <h4 className="mb-0 fw-bold text-dark">{studentsCount !== null ? studentsCount.toLocaleString() : '--'}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 col-md-6">
            <div className="card border-0 h-100" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="p-2 rounded" style={{ backgroundColor: '#eff6ff' }}>
                    <FaBoxOpen className="text-primary" size={20} />
                  </div>
                  <div className="ms-3">
                    <h6 className="text-muted mb-0 small">Number of Products</h6>
                    <h4 className="mb-0 fw-bold text-dark">{productsCount !== null ? productsCount.toLocaleString() : '--'}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card border-0" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaUsers className="text-primary me-2" size={18} />
                  <h6 className="mb-0 fw-semibold">Student Management</h6>
                </div>
                <p className="text-muted small mb-3">View and manage all registered students in the system</p>
                <button 
                  className={`btn btn-primary w-100 ${loading.students ? 'disabled' : ''}`}
                  onClick={fetchStudents}
                  disabled={loading.students}
                  style={{ borderRadius: '8px', padding: '12px' }}
                >
                  {loading.students ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Loading Students...
                    </>
                  ) : (
                    <>
                      <FaUsers className="me-2" size={16} />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaBoxOpen className="text-primary me-2" size={18} />
                  <h6 className="mb-0 fw-semibold">Avaiable Product</h6>
                </div>
                <p className="text-muted small mb-3">Browse and manage all products available for trade</p>
                <button 
                  className={`btn btn-primary w-100 ${loading.products ? 'disabled' : ''}`}
                  onClick={fetchProducts}
                  disabled={loading.products}
                  style={{ borderRadius: '8px', padding: '12px' }}
                >
                  {loading.products ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Loading Products...
                    </>
                  ) : (
                    <>
                      <FaBoxOpen className="me-2" size={16} />
                      Load All Products
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error.students && (
          <div className="alert alert-danger border-0 mb-4" style={{ borderRadius: '12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            <strong>Unable to load students:</strong> {error.students}
          </div>
        )}
        
        {error.products && (
          <div className="alert alert-danger border-0 mb-4" style={{ borderRadius: '12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            <strong>Unable to load products:</strong> {error.products}
          </div>
        )}

        {/* Data Display Section */}
        <div className="row g-4">
          {/* Students List */}
          {students.length > 0 && (
            <div className="col-lg-6">
              <div className="card border-0" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="card-body p-0">
                  <div className="p-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaUsers className="text-primary me-2" size={18} />
                        <h6 className="mb-0 fw-semibold">Active Students</h6>
                      </div>
                      <span className="badge bg-primary px-2 py-1" style={{ borderRadius: '6px' }}>{students.length}</span>
                    </div>
                  </div>
                  <div className="p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="row g-2">
                      {students.map((student, idx) => (
                        <div key={idx} className="col-12">
                          <div className="d-flex align-items-center p-3 rounded hover-bg-light" 
                               style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <div 
                              className="d-flex align-items-center justify-content-center me-3 text-white fw-semibold"
                              style={{ 
                                width: '36px', 
                                height: '36px', 
                                backgroundColor: '#3b82f6',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              {student.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-medium text-dark" style={{ fontSize: '14px' }}>{student}</div>
                              <small className="text-muted">Active Student</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          {products.length > 0 && (
            <div className="col-lg-6">
              <div className="card border-0" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="card-body p-0">
                  <div className="p-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaBoxOpen className="text-primary me-2" size={18} />
                        <h6 className="mb-0 fw-semibold">Available Products</h6>
                      </div>
                      <span className="badge bg-primary px-2 py-1" style={{ borderRadius: '6px' }}>{products.length}</span>
                    </div>
                  </div>
                  <div className="p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="row g-2">
                      {products.map((product, idx) => (
                        <div key={idx} className="col-12">
                          <div className="d-flex align-items-center p-3 rounded" 
                               style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                            <div 
                              className="d-flex align-items-center justify-content-center me-3 text-white fw-semibold"
                              style={{ 
                                width: '36px', 
                                height: '36px', 
                                backgroundColor: '#3b82f6',
                                borderRadius: '8px',
                                fontSize: '16px'
                              }}
                            >
                              {product.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-medium text-dark text-truncate" style={{ fontSize: '14px' }} title={product}>
                                {product}
                              </div>
                              <small className="text-muted">Available for Trade</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {students.length === 0 && products.length === 0 && !loading.students && !loading.products && (
          <div className="text-center py-5">
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-center mx-auto mb-3" 
                   style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
                <FaDatabase className="text-muted" size={32} />
              </div>
              <h5 className="text-dark mb-2">No Data Loaded</h5>
              <p className="text-muted mb-0">Use the action buttons above to load students and products data.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState } from "react";
import { FaUsers, FaBoxOpen } from "react-icons/fa";
import "../App.css"; // Import the CSS file

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

  const fetchStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    setError(prev => ({ ...prev, students: null }));

    try {
      const response = await fetch('http://localhost:8080/api/student/getAll');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract student names for display
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
      
      // Extract product names for display
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

  return (
    <div className="dashboard">
      {/* Main heading at the top center */}
      <div className="header-section">
        <h1 className="main-heading">📊 Admin Dashboard</h1>
        <p className="subtitle">Manage your student marketplace efficiently</p>
      </div>

      {/* Two column layout */}
      <div className="main-content">
        {/* Left Column - Students */}
        <div className="content-column">
          {/* Student Action Button */}
          <div className="actions-section">
            <button 
              className={`fetch-btn ${loading.students ? 'loading' : ''}`}
              onClick={fetchStudents}
              disabled={loading.students}
            >
              <FaUsers style={{ marginRight: "8px" }} /> 
              {loading.students ? "Loading..." : "Fetch Students"}
            </button>
          </div>

          {/* Student Error Message */}
          {error.students && (
            <div className="error-section">
              <div className="error-message">
                ⚠️ Error fetching students: {error.students}
              </div>
            </div>
          )}

          {/* Student Statistics */}
          <div className="stats-section">
            <div className="info-card">
              <div className="card-icon">
                <FaUsers size={24} />
              </div>
              <div className="card-content">
                <h3>Total Students</h3>
                <p className="card-number">{studentsCount !== null ? studentsCount : "-"}</p>
              </div>
            </div>
          </div>

          {/* Student List */}
          {students.length > 0 && (
            <div className="content-section">
              <div className="student-list">
                <div className="list-header">
                  <h2><FaUsers style={{ marginRight: "8px" }} /> Students</h2>
                  <span className="list-count">{students.length} found</span>
                </div>
                <div className="student-grid">
                  {students.map((student, idx) => (
                    <div key={idx} className="student-card">
                      <div className="student-avatar">
                        {student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="student-name">{student}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Products */}
        <div className="content-column">
          {/* Product Action Button */}
          <div className="actions-section">
            <button 
              className={`fetch-btn ${loading.products ? 'loading' : ''}`}
              onClick={fetchProducts}
              disabled={loading.products}
            >
              <FaBoxOpen style={{ marginRight: "8px" }} /> 
              {loading.products ? "Loading..." : "Fetch Products"}
            </button>
          </div>

          {/* Product Error Message */}
          {error.products && (
            <div className="error-section">
              <div className="error-message">
                ⚠️ Error fetching products: {error.products}
              </div>
            </div>
          )}

          {/* Product Statistics */}
          <div className="stats-section">
            <div className="info-card">
              <div className="card-icon">
                <FaBoxOpen size={24} />
              </div>
              <div className="card-content">
                <h3>Total Products</h3>
                <p className="card-number">{productsCount !== null ? productsCount : "-"}</p>
              </div>
            </div>
          </div>

          {/* Product List */}
          {products.length > 0 && (
            <div className="content-section">
              <div className="product-list">
                <div className="list-header">
                  <h2><FaBoxOpen style={{ marginRight: "8px" }} /> Products</h2>
                  <span className="list-count">{products.length} found</span>
                </div>
                <div className="student-grid">
                  {products.map((product, idx) => (
                    <div key={idx} className="student-card">
                      <div className="student-avatar">
                        {product.charAt(0).toUpperCase()}
                      </div>
                      <span className="student-name">{product}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuLogOut } from "react-icons/lu";

import { 
  CheckCircle, 
  XCircle, 
  People, 
  Clock, 
  CurrencyDollar, 
  Box 
} from "react-bootstrap-icons";
import { listRegisteredStudents } from "../service/StudentService";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        navigate("/");
        return;
      }
      setUser(parsedUser);
    } else {
      navigate("/");
      return;
    }

    const mockPendingRequests = [
      {
        id: 1,
        productName: "MacBook Air M2",
        description: "Barely used MacBook Air with M2 chip, perfect for students",
        status: "like-new",
        price: "1200",
        student: "John Smith",
        studentEmail: "john@student.edu",
        dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop"
      },
      {
        id: 2,
        productName: "Chemistry Textbook",
        description: "Organic Chemistry 8th Edition, good condition",
        status: "good",
        price: "45",
        student: "Sarah Johnson",
        studentEmail: "sarah@student.edu",
        dateSubmitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
      }
    ];

    const mockTransactions = [
      { id: 1, productName: "iPhone 13", buyer: "John Smith", seller: "Sarah Johnson", amount: 599, date: "2024-01-20", status: "completed" },
      { id: 2, productName: "Dell Laptop", buyer: "Mike Davis", seller: "John Smith", amount: 450, date: "2024-01-18", status: "completed" }
    ];

    setPendingRequests(mockPendingRequests);
    setTransactions(mockTransactions);

    listRegisteredStudents()
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, [navigate]);

  const handleApprove = (requestId) => {
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    toast.success("The listing has been approved and is now live.");
  };

  const handleDecline = (requestId) => {
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    toast.error("The listing has been declined and removed.");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Admin Dashboard</h1>
            <p className="text-muted mb-0">Welcome back, {user?.name}</p>
          </div>
          <button 
            className="btn btn-outline-secondary"
            onClick={handleLogout}
          >
            <LuLogOut className="me-2" size={16} />
            Logout
          </button>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-md-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <Clock className="text-warning mb-2" size={32} />
                <div className="h4 text-warning">{pendingRequests.length}</div>
                <div className="text-muted">Pending Requests</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <People className="text-primary mb-2" size={32} />
                <div className="h4 text-primary">{students.length}</div>
                <div className="text-muted">Active Students</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <Box className="text-success mb-2" size={32} />
                <div className="h4 text-success">{transactions.length}</div>
                <div className="text-muted">Total Transactions</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <CurrencyDollar className="text-purple mb-2" size={32} />
                <div className="h4 text-purple">
                  ${transactions.reduce((sum, t) => sum + t.amount, 0)}
                </div>
                <div className="text-muted">Total Volume</div>
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Requests
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === "students" ? "active" : ""}`}
              onClick={() => setActiveTab("students")}
            >
              Students
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === "transactions" ? "active" : ""}`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
          </li>
        </ul>

        {activeTab === "pending" && (
          <div>
            <h3 className="h4 mb-3">Pending Listing Requests</h3>
            {pendingRequests.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-5">
                  <Clock className="text-muted mb-3" size={48} />
                  <p className="text-muted">No pending requests</p>
                </div>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div className="card mb-3" key={request.id}>
                  <div className="card-body">
                    <div className="d-flex gap-3">
                      {request.image && (
                        <img
                          src={request.image}
                          alt={request.productName}
                          className="rounded"
                          style={{ width: "96px", height: "96px", objectFit: "cover" }}
                        />
                      )}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between mb-2">
                          <h4 className="h5 mb-0">{request.productName}</h4>
                          <div className="text-end">
                            <div className="h5 text-success mb-1">${request.price}</div>
                            <span className={`badge bg-warning-subtle text-warning-emphasis text-capitalize`}>
                              {request.status.replace("-", " ")}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted mb-2">{request.description}</p>
                        <div className="small text-muted mb-3">
                          <p className="mb-1">Submitted by: {request.student} ({request.studentEmail})</p>
                          <p className="mb-0">Date: {new Date(request.dateSubmitted).toLocaleDateString()}</p>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="me-2" size={16} />
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDecline(request.id)}
                          >
                            <XCircle className="me-2" size={16} />
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div>
            <h3 className="h4 mb-3">Student Management</h3>
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Residence</th>
                        <th>Sales</th>
                        <th>Purchases</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.studentId}>
                          <td>{student.firstName}</td>
                          <td>{student.lastName}</td>
                          <td>{student.email}</td>
                          <td>{student.residence?.residenceName || "N/A"}</td>
                          <td>{student.productForSale?.length || 0}</td>
                          <td>{student.purchases?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            <h3 className="h4 mb-3">Transaction History</h3>
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Buyer</th>
                        <th>Seller</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{transaction.productName}</td>
                          <td>{transaction.buyer}</td>
                          <td>{transaction.seller}</td>
                          <td>${transaction.amount}</td>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-success-subtle text-success-emphasis text-capitalize">
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
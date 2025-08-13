import { useState } from "react";
import { useNavigate } from "react-router-dom";

const REST_API_BASE_URL = 'http://localhost:8080/api';

export const authenticateUser = ({ email, password }) => {
  return fetch(`${REST_API_BASE_URL}/students/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
    method: 'GET'
  });
};

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authenticateUser({
        email: credentials.identifier,
        password: credentials.password
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (response.ok && result.success) {
        // Save user data
        const userData = { ...result.data, role: result.role };
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on role
        if (result.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }

        alert(`Welcome back, ${result.data.firstName}!`);
      } else {
        alert(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div className="card w-100" style={{ maxWidth: "400px" }}>
        <div className="card-header text-center bg-white border-0">
          <h2 className="card-title text-primary mb-1">Login</h2>
          <p className="text-muted">Login to your SouthPoint Student Trade</p>
        </div>
        <div className="card-body">
          <div>
            <div className="mb-3">
              <label htmlFor="identifier" className="form-label">Email</label>
              <input
                id="identifier"
                type="email"
                className="form-control"
                placeholder="*******@mycput.ac.za"
                value={credentials.identifier}
                onChange={(e) => setCredentials(prev => ({ ...prev, identifier: e.target.value }))}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="********"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing In...
                </>
              ) : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-4">
        <h1 className="display-1 fw-bold mb-3">404</h1>
        <p className="fs-3 text-muted mb-4">Oops! Page not found</p>
        <a href="/" className="text-decoration-none">
          <button className="btn btn-primary">
            Return to Home
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
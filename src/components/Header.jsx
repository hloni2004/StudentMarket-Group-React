import React from "react";

const Header = () => {
  return (
    <header className="bg-light shadow-sm">
      <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between py-3">
       
        <h1 className="h1 text-primary mb-3 ">Student Marketplace</h1>

        
        <nav>
          <ul className="nav nav-tabs nav-fill">
     <li className="nav-item">
      <a className="nav-link active" href="/">
                <i className="bi bi-house-door me-1"></i>Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Buy">
     <i className="bi bi-cart me-1"></i>Buy
      </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Sell">
     <i className="bi bi-cash me-1"></i>Sell
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Profile">
                <i className="bi bi-person me-1"></i>Profile
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#1B3C53' }}>
        <a className="navbar-brand ms-5 fs-3 navbar-font" style={{ color: '#F9F3EF' }} href="#">
          EXPENSE TRACKER
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-5 fs-4">
            <li className="nav-item active">
              <button
                type="button"
                className="btn btn-outline-light mx-2 navbar-font"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard <span className="sr-only">(current)</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-outline-light mx-2 navbar-font"
                onClick={() => navigate('/budget')}
              >
                Budget
              </button>
            </li>
            <li className="nav-item mx-2">
              <button
                type="button"
                className="btn btn-outline-light mx-2 navbar-font"
                onClick={() => navigate('/report')}
              >
                Report
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

import React from 'react'

const Navbar = () => {
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: '#1B3C53'}}>
  <a className="navbar-brand ms-5 fs-3" style={{ color: '#F9F3EF' }} href="#">EXPENSE TRACKER</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav ms-auto me-5 fs-4">
      <li className="nav-item active">
        <a className="nav-link" style={{ color: '#F9F3EF' }} href="#">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" style={{ color: '#F9F3EF' }} href="#">Features</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" style={{ color: '#F9F3EF' }} href="#">Pricing</a>
      </li>
    </ul>
  </div>
</nav>


    </div>
  )
}

export default Navbar
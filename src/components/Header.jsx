import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        {/* LOGO */}
        <Link to="/" className="site-header__logo">
          LOGO
        </Link>

        {/* SHOP */}
        <nav className="site-header__nav">
          <NavLink
            to="/product"
            className={({ isActive }) =>
              `site-header__link ${isActive ? "is-active" : ""}`
            }
          >
            🍽️ SHOP
          </NavLink>
        </nav>

        <div className="site-header__actions">
          {/* Cart */}
          <Link to="/cart" className="site-header__icon">
            <i className="bi bi-cart2"></i>
          </Link>
          {/* Chekout */}
          <Link to="/checkout" className="site-header__icon">
            <i className="bi bi-credit-card"></i>
          </Link>
          {/* Login */}
          <Link to="/login" className="site-header__icon">
            <i class="bi bi-person-gear"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-mobile-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <div className="nav-mobile-menu">
          <ul className="menu-list">
            <li className="menu-list-item">
              <Link to="/" className="nav-link">
                <AiFillHome className="nav-icon" />
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/jobs" className="nav-link">
                <BsFillBriefcaseFill className="nav-icon" />
              </Link>
            </li>
            <li className="menu-list-item">
              <button
                className="logout-btn"
                type="button"
                onClick={onClickLogout}
              >
                <FiLogOut className="nav-icon" />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="nav-large-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <ul className="nav-menu">
          <li className="nav-menu-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)

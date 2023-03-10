import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

function Nav() {
  const [show, setShow] = useState(false);

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className='nav__contents'>
        <Link to='/'>
          <img
            className='nav__logo'
            src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png'
            alt='netflix_logo.png'
          />
        </Link>

        <Link to='/profile'>
          <img
            onClick={() => {}}
            className='nav__avatar'
            src='https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
            alt=''
          />
        </Link>
      </div>
    </div>
  );
}

export default Nav;

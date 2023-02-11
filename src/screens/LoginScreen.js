import React, { useEffect, useState } from "react";
import "./LoginScreen.css";
import SignupScreen from "./SignupScreen";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function LoginScreen() {
  const [signIn, setSignIn] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className='loginScreen'>
      <div className='loginScreen__header'>
        <img
          className='loginScreen__logo'
          src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png'
          alt='logo.png'
        />

        <button className='loginScreen__button' onClick={() => setSignIn(true)}>
          Sign In
        </button>
      </div>

      <div className='loginScreen__body'>
        {signIn ? (
          <SignupScreen />
        ) : (
          <>
            <h1>Unlimited films, TV programmes and more.</h1>
            <h2>Watch anywhere. Cancel at anytime</h2>
            <h3>
              Ready to watch? Enter your email to create or restart your
              membership
            </h3>

            <div className='loginScreen__input'>
              <form action=''>
                <input type='email' placeholder='Email address' />
                <button
                  onClick={() => setSignIn(true)}
                  className='loginScreen__getStarted'
                >
                  GET STARTED
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <div className='loginScreen__gradient' />
    </div>
  );
}

export default LoginScreen;

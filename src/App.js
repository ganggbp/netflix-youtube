import React, { useEffect } from "react";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import ProfileScreen from "./screens/ProfileScreen";
import PrivateRoutes from "./utils/PrivateRoutes";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<HomeScreen />} path='/' exact />
            <Route element={<ProfileScreen />} path='/profile' />
          </Route>

          <Route element={<LoginScreen />} path='/login' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

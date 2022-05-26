import React, { useState,useEffect } from "react";
import "./login.css";
import { Typography, Button, IconButton, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import { loginUser } from "../../Actions/User";
import { useAlert } from 'react-alert';
import { Visibility, VisibilityOff } from "@mui/icons-material";
const Login = () => {
const [showPassword, setShowPassword] = useState(false);
const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error} = useSelector((state) => state.user);
  const { message } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const alert = useAlert();
  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email,password));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, dispatch, message]);
  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler}>
        <Typography variant="h3" style={{ padding: "2vmax", fontFamily:"cursive" }}>
         Social App
        </Typography>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"} 
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >

      </input>
          <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword} >
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
      
{/* //end */}
        <Link to="/forgot/password">Forgot Password?</Link>
        <Button type="submit">Login</Button>
        <Link to="/register">New User?</Link>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
 
import axios from "axios";
 
import { useNavigate } from "react-router-dom";
 
import "./LoginComponent.css"; // Import the CSS file
 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
 
const LoginComponent = ({ setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
 
  const [errors, setErrors] = useState({ 
    username: "", 
    password: "" 
  });
 
  const [showPassword, setShowPassword] = useState(false);
 
  const navigate = useNavigate();
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
 
    setCredentials({ ...credentials, [name]: value });
 
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };
 
  const validateUsername = (username) => {
    if (!/^[A-Za-z][A-Za-z0-9_@]*$/.test(username)) {
      return "Username must start with an alphabet and can only contain alphanumeric characters, underscore, and @ symbol.";
    }
 
    if (username.length < 2) {
      return "Username must be at least 6 characters long.";
    }
 
    return "";
  };
 
  const validatePassword = (password) => {
    if (password.length < 2) {
      return "Password must be at least 6 characters long.";
    }
 
    //(?=.*[@$!%*?&]) to be added (?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]
    // if (
    //   !/(?=.*[a-z])(?=.*[@$!%*?&]) to be added (?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+/.test(
    //     password
    //   )
    // ) {
    //   return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    // }
 
    return "";
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const usernameError = validateUsername(credentials.username);
 
    const passwordError = validatePassword(credentials.password);
 
    if (usernameError || passwordError) {
      setErrors({ username: usernameError, password: passwordError });
 
      return;
    }
 
    try {
      const response = await axios.post(
        "http://localhost:5203/api/Users/login",
        credentials
      );
 
      const { token, role } = response.data;
 
      localStorage.setItem("token", token);
 
      localStorage.setItem("username", credentials.username);
 
      localStorage.setItem("role", role);
 
      console.log("Login successful:", response.data); // Debug log
 
      //setIsLoggedIn(true); // Update login status
 
      if (role === "Admin") {
        navigate("/homeadmin");
      } else if (role === "User") {
        navigate("/homeuser");
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Error logging in:", error);
 
      setErrors({ ...errors, general: "Invalid username or password." });
    }
  };
 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };
 
  const handleRegister = () => {
    navigate("/register");
  };
 
  const handlehome = () => {
    navigate("/");
  };
 
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && <p className="error-message">{errors.general}</p>}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleInputChange}
              required
            />
 
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>
          <div className="input-group password-input-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
 
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <button type="submit" className="login-button bttttn">
            Log In
          </button>
        </form>
        <div className="options">
          <button
            onClick={handleForgotPassword}
            className="forgot-password-button"
          >
            Forgot Password?
          </button>
          <button onClick={handleRegister} className="register-button">
            Register
          </button>
        </div>
        <button onClick={handlehome} className="home-button">
          Home
        </button>
      </div>
    </div>
  );
};
 
export default LoginComponent;
 
 
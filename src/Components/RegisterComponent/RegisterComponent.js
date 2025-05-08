import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegisterComponent.css';
import { Link, useNavigate } from 'react-router-dom';

function RegisterComponent({ setActiveComponent }) {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Optional: Add immediate field validation here if needed,
    // but the main validation happens in validate() before submit.
  };

  const validate = () => {
    let tempErrors = {};

    // --- Name Validation ---
    if (!form.name.trim()) {
        tempErrors.name = "Name is required."; // Added required check
    } else if (form.name.length < 2) {
        tempErrors.name = "Name must be at least 2 characters long.";
    } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
      tempErrors.name = "Name must contain only letters and spaces.";
    }

    // --- Username Validation ---
     if (!form.username.trim()) {
        tempErrors.username = "Username is required."; // Added required check
    } else if (form.username.length < 4) {
      tempErrors.username = "Username must be at least 4 characters.";
    }


    if (!form.password) {
        tempErrors.password = "Password is required."; 
    } else if (form.password.length < 6) {
        tempErrors.password = "Password must be at least 6 characters long.";
    }
    // Add checks for character types
    else if (!/(?=.*[A-Z])/.test(form.password) || // At least one uppercase letter
             !/(?=.*[a-z])/.test(form.password) || // At least one lowercase letter
             !/(?=.*\d)/.test(form.password) ||    // At least one digit
             !/(?=.*[@$!%*?&])/.test(form.password) // At least one special character (you can customize the special characters here)
            )
    {
      // Set the specific error message
      tempErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    // If it passes all password checks, ensure no password error is set
     else {
         delete tempErrors.password;
     }

    // --- Email Validation ---
     if (!form.email.trim()) {
         tempErrors.email = "Email is required."; 
     } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        tempErrors.email = "Enter a valid email address.";
    }

    // --- Phone Validation ---
    if (!form.phone.trim()) {
         tempErrors.phone = "Phone number is required."; 
    } else if (!/^\d{10}$/.test(form.phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // --- Address Validation ---
    if (!form.address.trim()) {
      tempErrors.address = "Address is required.";
    }

    // --- Security Question Validation ---
    if (!form.securityQuestion) {
      tempErrors.securityQuestion = "Please select a security question.";
    }

    // --- Security Answer Validation ---
    if (!form.securityAnswer.trim()) {
      tempErrors.securityAnswer = "Security answer is required.";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the highlighted errors.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = "https://webapiproject-ffx8.onrender.com/api/Users/register";

    try {
      const res = await axios.post(url, {
        Name: form.name,
        Username: form.username,
        Password: form.password,
        Email: form.email,
        Phone: form.phone,
        Address: form.address,
        Role: "User",
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer
      });

      toast.success(res.data.message || "User registered successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Registration failed!";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <div className="card">
        <ToastContainer />
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="form">
          <div>
            <label>Name</label>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /> 
          </div>

          <div>
            <label>Username</label>
            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required /> 
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required /> 
            <div className="error">{errors.password}</div> {/* Error message will appear here */}
          </div>

          <div>
            <label>Email</label>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /> {/* Added value prop */}
            <div className="error">{errors.email}</div>
          </div>

          <div>
            <label>Phone</label>
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required /> {/* Added value prop */}
            <div className="error">{errors.phone}</div>
          </div>

          <div>
            <label>Address</label>
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required /> {/* Added value prop */}
            <div className="error">{errors.address}</div>
          </div>

          <div>
            <label>Security Question</label>
            <select name="securityQuestion" value={form.securityQuestion} onChange={handleChange} required> {/* Added value prop */}
              <option value="">Select a question</option>
              <option value="What is your mother's maiden name?">Mother's maiden name?</option>
              <option value="What was the name of your first pet?">First pet's name?</option>
              <option value="What was the name of your elementary school?">Elementary school?</option>
              <option value="What is your favorite book?">Favorite book?</option>
            </select>
            <div className="error">{errors.securityQuestion}</div>
          </div>

          <div>
            <label>Security Answer</label>
            <input type="text" name="securityAnswer" placeholder="Security Answer" value={form.securityAnswer} onChange={handleChange} required /> {/* Added value prop */}
            <div className="error">{errors.securityAnswer}</div>
          </div>

          <button type="submit">Register</button>
        </form>
        <Link to="/">
          <button type="button" className="hm-btn">Home</button>
        </Link>
        <p>Have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default RegisterComponent;
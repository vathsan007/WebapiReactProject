import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPasswordComponent.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom';

const ForgotPasswordComponent = () => {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setSelectedQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setSecurityAnswer(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const fetchUserInfo = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`http://localhost:5203/api/Users/getUser/${username}`);
      setUserInfo(response.data);
      setIsFetching(false);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setIsFetching(false);
      toast.error('Error fetching user information.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // --- Password Validation (Added as requested) ---
    if (!newPassword) {
        toast.error('Please enter a new password.');
        return; // Stop the function if password is empty
    }
    if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long.');
        return; // Stop the function if too short
    }
    // Regex to check for at least one uppercase, lowercase, digit, and one special character from @$!%*?&
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

    if (!passwordRegex.test(newPassword)) {
        toast.error('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return; // Stop the function if complexity rules are not met
    }
    // --- End Password Validation ---


    if (!userInfo) {
      toast.error('Please fetch user information first.');
      return;
    }
    if (selectedQuestion !== userInfo.securityQuestion || securityAnswer !== userInfo.securityAnswer) {
      toast.error('Incorrect security question or answer.');
      return;
    }
    try {
      await axios.post('http://localhost:5203/api/Users/reset-password', {
        email: userInfo.email,
        securityQuestion: selectedQuestion,
        securityAnswer: securityAnswer,
        newPassword: newPassword
      });
      toast.success('Password reset successfully.');
      // Optionally clear the form and reset state
      setUsername('');
      setUserInfo(null);
      setSelectedQuestion('');
      setSecurityAnswer('');
      setNewPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error resetting password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {!userInfo ? (
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username} // Kept existing value prop
            onChange={handleUsernameChange}
            required
          />
          <button onClick={fetchUserInfo} disabled={isFetching} className="primary-button">
            {isFetching ? 'Fetching...' : 'Next'}
          </button>
          <Link to="/"><button className="primary-button">Back To Home Page</button></Link>
        </div>



      ) : (
        <form onSubmit={handlePasswordReset} className="reset-form">
          <div className="user-info">
            <p><strong>User ID:</strong> {userInfo.userId}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
          </div>
          <div className="form-group">
            <label htmlFor="securityQuestion">Security Question:</label>
            <select
              id="securityQuestion"
              name="securityQuestion"
              value={selectedQuestion} // Kept existing value prop
              onChange={handleQuestionChange}
              required
            >
              <option value="">Select a question</option>
              <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              <option value="What was the name of your first pet?">What was the name of your first pet?</option>
              <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
              <option value="What is your favorite book?">What is your favorite book?</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="securityAnswer"
              placeholder="Security Answer"
              value={securityAnswer} // Kept existing value prop
              onChange={handleAnswerChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={newPassword} // Kept existing value prop
              onChange={handlePasswordChange}
              required
            />
             {/* No specific error display added here as per minimal change request */}
          </div>
          <button type="submit" className="primary-button">Reset Password</button>
          <br/>
          <Link to="/"><button className="primary-button">Back To Home Page</button></Link>
        </form>


      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ForgotPasswordComponent;
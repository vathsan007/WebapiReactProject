import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AccountComponent.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AccountComponent = () => {
    const [userInfo, setUserInfo] = useState({
        userId: '',
        name: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        securityQuestion: '',
        securityAnswer: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            try {
                const response = await axios.get(`https://webapiproject-ffx8.onrender.com/api/Users/getUser/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error on input change
        if (name === 'address') {
            setUserInfo(prevInfo => ({
                ...prevInfo,
                [name]: value.charAt(0).toUpperCase() + value.slice(1)
            }));
        }
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        setErrors({ ...errors, newPassword: '' });
    };

    const validateName = (name) => {
        if (name.length < 4) {
            return 'Name must be at least 4 characters long.';
        }
        if (/\d/.test(name)) {
            return 'Name cannot contain numerical values.';
        }
        return '';
    };

    const validateUsername = (username) => {
        if (/^[^a-zA-Z0-9]/.test(username)) {
            return 'Username cannot start with a special character.';
        }
        if (username.length < 4) {
            return 'Username must be at least 4 characters long.';
        }
        return '';
    };

    const validateEmail = (email) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Invalid email format.';
        }
        if (/^[0-9\W]/.test(email)) {
            return 'Email cannot start with a number or special character.';
        }
        return '';
    };

    const validatePhone = (phone) => {
        if (!/^\d{10}$/.test(phone)) {
            return 'Phone number must be exactly 10 digits.';
        }
        return '';
    };

    const validateNewPassword = (password) => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long.';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+/.test(password)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
        }
        return '';
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const nameError = validateName(userInfo.name);
        const usernameError = validateUsername(userInfo.username);
        const emailError = validateEmail(userInfo.email);
        const phoneError = validatePhone(userInfo.phone);

        if (nameError || usernameError || emailError || phoneError) {
            setErrors({ name: nameError, username: usernameError, email: emailError, phone: phoneError });
            return;
        }

        try {
            console.log('Updating user details:', userInfo); // Debug log
            await axios.put('https://webapiproject-ffx8.onrender.com/api/Users/update', userInfo, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsEditing(false);
            
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const newPasswordError = validateNewPassword(newPassword);

        if (newPasswordError) {
            setErrors({ ...errors, newPassword: newPasswordError });
            return;
        }

        try {
            console.log('Resetting password:', {
                email: userInfo.email,
                securityQuestion: userInfo.securityQuestion,
                securityAnswer: userInfo.securityAnswer,
                newPassword: newPassword
            }); // Debug log
            await axios.post('https://webapiproject-ffx8.onrender.com/api/Users/reset-password', {
                email: userInfo.email,
                securityQuestion: userInfo.securityQuestion,
                securityAnswer: userInfo.securityAnswer,
                newPassword: newPassword
            });
            toast.success('Password reset successfully.');
            setShowResetPassword(false); // Hide after successful reset
            setNewPassword(''); // Clear the password field
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    const toggleResetPassword = () => {
        setShowResetPassword(!showResetPassword);
    };

    if (!userInfo) {
        return <div className="loading-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="account-page">
            <div className="account-card">
                <h2>User Profile</h2>
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="edit-form">
                        <div className="form-group">
                            <label htmlFor="userId">User ID:</label>
                            <input type="text" id="userId" name="userId" value={userInfo.userId} readOnly className="small-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" placeholder="Name" value={userInfo.name} onChange={handleInputChange} required className="small-input" />
                            {errors.name && <p className="error-message">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" placeholder="Username" value={userInfo.username} onChange={handleInputChange} required className="small-input" />
                            {errors.username && <p className="error-message">{errors.username}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" placeholder="Email" value={userInfo.email} onChange={handleInputChange} required className="small-input" />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone:</label>
                            <input type="text" id="phone" name="phone" placeholder="Phone" value={userInfo.phone} onChange={handleInputChange} required className="small-input" />
                            {errors.phone && <p className="error-message">{errors.phone}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input type="text" id="address" name="address" placeholder="Address" value={userInfo.address} onChange={handleInputChange} required className="small-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="securityQuestion">Security Question:</label>
                            <select
                                id="securityQuestion"
                                name="securityQuestion"
                                value={userInfo.securityQuestion}
                                onChange={handleInputChange}
                                required
                                className="small-input"
                            >
                                <option value="">Select a question</option>
                                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                                <option value="What is your favorite book?">What is your favorite book?</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="securityAnswer">Security Answer:</label>
                            <input type="text" id="securityAnswer" name="securityAnswer" placeholder="Security Answer" value={userInfo.securityAnswer} onChange={handleInputChange} required className="small-input" />
                        </div>
                        <button type="submit" className="update-button">Update</button>
                    </form>
                ) : (
                    <div className="profile-info">
                        <div className="info-item">
                            <label>User ID:</label>
                            <input type="text" value={userInfo.userId} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Name:</label>
                            <input type="text" value={userInfo.name} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Username:</label>
                            <input type="text" value={userInfo.username} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <input type="text" value={userInfo.email} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Phone:</label>
                            <input type="text" value={userInfo.phone} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Address:</label>
                            <input type="text" value={userInfo.address} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Role:</label>
                            <input type="text" value={userInfo.role} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Security Question:</label>
                            <input type="text" value={userInfo.securityQuestion} readOnly className="small-input" />
                        </div>
                        <div className="info-item">
                            <label>Security Answer:</label>
                            <input type="text" value={userInfo.securityAnswer} readOnly className="small-input" />
                        </div>
                        <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
                    </div>
                )}
                <div className="password-reset-container">
                    <h3 onClick={toggleResetPassword} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Reset Password
                        <FontAwesomeIcon icon={showResetPassword ? faChevronUp : faChevronDown} />
                    </h3>
                    {showResetPassword && (
                        <form onSubmit={handlePasswordReset} className="reset-password-form">
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password:</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="small-input"
                                />
                                {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
                            </div>
                            <button type="submit" className="reset-button">Reset Password</button>
                        </form>
                    )}
                </div>
            </div>
                  <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            
        </div>
    );
};

export default AccountComponent;
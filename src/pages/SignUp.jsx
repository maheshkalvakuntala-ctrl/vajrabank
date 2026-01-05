import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { userAuth, userDB } from '../firebaseUser';
import "./SignUp.css";

export default function SignUp() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        idProofType: '',
        idProofNumber: '',
        accountType: 'Savings',
        initialDeposit: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
        if (!/^.+@.+\..+$/.test(formData.email)) newErrors.email = 'Valid email is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
        if (!formData.idProofType) newErrors.idProofType = 'ID proof type is required';
        if (!formData.idProofNumber.trim()) newErrors.idProofNumber = 'ID proof number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors = {};
        if (!formData.accountType) newErrors.accountType = 'Account type is required';
        const deposit = Number(formData.initialDeposit);
        if (!formData.initialDeposit || deposit <= 0) {
            newErrors.initialDeposit = 'Initial deposit must be greater than ₹0';
        }
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        let isValid = false;
        if (currentStep === 1) isValid = validateStep1();
        else if (currentStep === 2) isValid = validateStep2();

        if (isValid && currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep3()) return;

        setSubmitting(true);

        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                userAuth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // Save user profile in Firestore
            const userProfile = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                mobile: formData.mobile,
                accountType: formData.accountType,
                balance: Number(formData.initialDeposit) || 0,
                status: "pending",
                transactions: [],
                loans: [],
                createdAt: serverTimestamp(),
                // Additional profile data
                dob: formData.dob,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                idProofType: formData.idProofType,
                idProofNumber: formData.idProofNumber
            };

            await setDoc(doc(userDB, 'users', user.uid), userProfile);

            // Create Admin Notification
            await addDoc(collection(userDB, 'notifications'), {
                type: 'new_user',
                message: `New account request from: ${userProfile.email}`,
                userId: user.uid,
                read: false,
                createdAt: serverTimestamp()
            });

            alert('Account request sent to admin for approval. You will be notified once approved.');
            navigate('/login');

        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Failed to create account';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already registered. Please login.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please choose a stronger password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            }

            setErrors({ general: errorMessage });
            setSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="step-container">
            <h3 className="step-title">Personal Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>First Name *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Enter first name"
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label>Last Name *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Enter last name"
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
                <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="signup-input"
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dob && <span className="error-text">{errors.dob}</span>}
                </div>
                <div className="form-group">
                    <label>Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="signup-input">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
                <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="10 digit mobile number"
                        maxLength={10}
                    />
                    {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="your@email.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="step-container">
            <h3 className="step-title">Address & Identity</h3>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Enter full address"
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
                <div className="form-group">
                    <label>City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="City"
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-group">
                    <label>State *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="State"
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
                <div className="form-group">
                    <label>Pincode *</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="6 digit pincode"
                        maxLength={6}
                    />
                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>
                <div className="form-group">
                    <label>ID Proof Type *</label>
                    <select name="idProofType" value={formData.idProofType} onChange={handleChange} className="signup-input">
                        <option value="">Select ID type</option>
                        <option value="Aadhaar">Aadhaar</option>
                        <option value="PAN">PAN Card</option>
                        <option value="Passport">Passport</option>
                    </select>
                    {errors.idProofType && <span className="error-text">{errors.idProofType}</span>}
                </div>
                <div className="form-group">
                    <label>ID Proof Number *</label>
                    <input
                        type="text"
                        name="idProofNumber"
                        value={formData.idProofNumber}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Enter ID number"
                    />
                    {errors.idProofNumber && <span className="error-text">{errors.idProofNumber}</span>}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="step-container">
            <h3 className="step-title">Account Setup</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Account Type *</label>
                    <select name="accountType" value={formData.accountType} onChange={handleChange} className="signup-input">
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                    </select>
                    {errors.accountType && <span className="error-text">{errors.accountType}</span>}
                </div>
                <div className="form-group">
                    <label>Initial Deposit (₹) *</label>
                    <input
                        type="number"
                        name="initialDeposit"
                        value={formData.initialDeposit}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Enter amount"
                        min="1"
                    />
                    {errors.initialDeposit && <span className="error-text">{errors.initialDeposit}</span>}
                </div>
                <div className="form-group">
                    <label>Username (optional)</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Auto-generated from email"
                    />
                </div>
                <div className="form-group">
                    <label>Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Minimum 8 characters"
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <label>Confirm Password *</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="signup-input"
                        placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
            </div>
            {errors.general && <div className="error-text" style={{ marginTop: '10px' }}>{errors.general}</div>}
        </div>
    );

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Create Your Account</h1>
                <p className="signup-subtitle">Join VajraBank for secure and smart banking</p>

                {/* Progress Indicator */}
                <div className="progress-container">
                    {[1, 2, 3].map(step => (
                        <div key={step} className="progress-step">
                            <div className={`progress-circle ${step <= currentStep ? 'active' : ''}`}>
                                {step}
                            </div>
                            <span className="progress-label">
                                {step === 1 ? 'Personal' : step === 2 ? 'Address' : 'Account'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Steps */}
                <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    {/* Navigation Buttons */}
                    <div className="button-container">
                        {currentStep > 1 && (
                            <button type="button" onClick={handlePrevious} className="signup-btn-secondary">
                                Previous
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button type="button" onClick={handleNext} className="signup-btn-primary">
                                Next
                            </button>
                        ) : (
                            <button type="submit" className="signup-btn-primary" disabled={submitting}>
                                {submitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        )}
                    </div>
                </form>

                <p className="login-footer">
                    Already have an account? <Link to="/login" className="login-link">Login here</Link>
                </p>
            </div>
        </div>
    );
}

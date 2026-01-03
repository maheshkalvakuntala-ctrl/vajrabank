import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { userAuth, userDB } from '../firebaseUser';

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
        <div style={styles.stepContainer}>
            <h3 style={styles.stepTitle}>Personal Details</h3>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>First Name *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Enter first name"
                    />
                    {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Last Name *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Enter last name"
                    />
                    {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Date of Birth *</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        style={styles.input}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dob && <span style={styles.error}>{errors.dob}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span style={styles.error}>{errors.gender}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Mobile Number *</label>
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="10 digit mobile number"
                        maxLength={10}
                    />
                    {errors.mobile && <span style={styles.error}>{errors.mobile}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="your@email.com"
                    />
                    {errors.email && <span style={styles.error}>{errors.email}</span>}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div style={styles.stepContainer}>
            <h3 style={styles.stepTitle}>Address & Identity</h3>
            <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Address *</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Enter full address"
                    />
                    {errors.address && <span style={styles.error}>{errors.address}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="City"
                    />
                    {errors.city && <span style={styles.error}>{errors.city}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>State *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="State"
                    />
                    {errors.state && <span style={styles.error}>{errors.state}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Pincode *</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="6 digit pincode"
                        maxLength={6}
                    />
                    {errors.pincode && <span style={styles.error}>{errors.pincode}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>ID Proof Type *</label>
                    <select name="idProofType" value={formData.idProofType} onChange={handleChange} style={styles.input}>
                        <option value="">Select ID type</option>
                        <option value="Aadhaar">Aadhaar</option>
                        <option value="PAN">PAN Card</option>
                        <option value="Passport">Passport</option>
                    </select>
                    {errors.idProofType && <span style={styles.error}>{errors.idProofType}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>ID Proof Number *</label>
                    <input
                        type="text"
                        name="idProofNumber"
                        value={formData.idProofNumber}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Enter ID number"
                    />
                    {errors.idProofNumber && <span style={styles.error}>{errors.idProofNumber}</span>}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div style={styles.stepContainer}>
            <h3 style={styles.stepTitle}>Account Setup</h3>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Account Type *</label>
                    <select name="accountType" value={formData.accountType} onChange={handleChange} style={styles.input}>
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                    </select>
                    {errors.accountType && <span style={styles.error}>{errors.accountType}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Initial Deposit (₹) *</label>
                    <input
                        type="number"
                        name="initialDeposit"
                        value={formData.initialDeposit}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Enter amount"
                        min="1"
                    />
                    {errors.initialDeposit && <span style={styles.error}>{errors.initialDeposit}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Username (optional)</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Auto-generated from email"
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Minimum 8 characters"
                    />
                    {errors.password && <span style={styles.error}>{errors.password}</span>}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm Password *</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
                </div>
            </div>
            {errors.general && <div style={{ ...styles.error, marginTop: '10px' }}>{errors.general}</div>}
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Create Your Account</h1>
                <p style={styles.subtitle}>Join VajraBank for secure and smart banking</p>

                {/* Progress Indicator */}
                <div style={styles.progressContainer}>
                    {[1, 2, 3].map(step => (
                        <div key={step} style={styles.progressStep}>
                            <div style={{
                                ...styles.progressCircle,
                                ...(step <= currentStep ? styles.progressCircleActive : {})
                            }}>
                                {step}
                            </div>
                            <span style={styles.progressLabel}>
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
                    <div style={styles.buttonContainer}>
                        {currentStep > 1 && (
                            <button type="button" onClick={handlePrevious} style={styles.buttonSecondary}>
                                Previous
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button type="button" onClick={handleNext} style={styles.buttonPrimary}>
                                Next
                            </button>
                        ) : (
                            <button type="submit" style={styles.buttonPrimary} disabled={submitting}>
                                {submitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        )}
                    </div>
                </form>

                <p style={styles.loginLink}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #080f25 0%, #0c142c 100%)',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        background: 'rgba(12, 20, 44, 0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    },
    title: {
        color: '#fff',
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '10px',
        textAlign: 'center'
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '30px'
    },
    progressContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '40px',
        position: 'relative'
    },
    progressStep: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    },
    progressCircle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#1e293b',
        border: '2px solid #334155',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#64748b',
        fontWeight: '600',
        marginBottom: '8px'
    },
    progressCircleActive: {
        background: '#3b82f6',
        border: '2px solid #3b82f6',
        color: '#fff'
    },
    progressLabel: {
        color: '#94a3b8',
        fontSize: '12px'
    },
    stepContainer: {
        marginBottom: '30px'
    },
    stepTitle: {
        color: '#fff',
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        color: '#e2e8f0',
        fontSize: '14px',
        marginBottom: '8px',
        fontWeight: '500'
    },
    input: {
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '12px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s ease'
    },
    error: {
        color: '#ef4444',
        fontSize: '12px',
        marginTop: '4px'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        marginTop: '30px'
    },
    buttonPrimary: {
        flex: 1,
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    buttonSecondary: {
        flex: 1,
        background: 'transparent',
        color: '#94a3b8',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '14px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease'
    },
    loginLink: {
        color: '#94a3b8',
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '20px'
    },
    link: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

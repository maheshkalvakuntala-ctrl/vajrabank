import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [mode, setMode] = useState("user"); // user | signup

  // common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // signup-only
  const [firstname, setFirstname] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ================= TYPING ANIMATION ================= */
  const fullText = "Secure Banking Access";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [index]);

  /* ================= PASSWORD VALIDATION ================= */
  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      setError("Image must be under 800KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= MAIN SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    /* -------- SIGNUP -------- */
    if (mode === "signup") {
      if (!validatePassword(password)) {
        setError(
          "Password must be at least 8 characters with uppercase, lowercase & number"
        );
        setSubmitting(false);
        return;
      }

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setError("Email already registered. Please login.");
          setSubmitting(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          firstname,
          email,
          mobile,
          image,
          role: "user",
          createdAt: new Date(),
        });

        alert("Account created successfully!");
        setMode("user");
        setFirstname("");
        setMobile("");
        setPassword("");
        setImage("");
        setShowPassword(false);
        setSubmitting(false);
        return;
      } catch (err) {
        setError(err.message);
        setSubmitting(false);
        return;
      }
    }

    /* -------- LOGIN -------- */
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔴 IMPORTANT: await because loginUser fetches Firestore
      await loginUser({
        uid: user.uid,
        email: user.email,
        role: "user",
      });

      setShowPassword(false);
      navigate("/user/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-container">
        <h2 className="typing-text">
          {typedText}
          <span className="cursor">.</span>
        </h2>

        <p className="subtitle">Sign in to access your dashboard</p>

        {error && <p style={{ color: "salmon" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* ================= SIGNUP EXTRA ================= */}
          {mode === "signup" && (
            <>
              <div className="profile-upload">
                <label className="avatar-circle">
                  {image ? (
                    <img src={image} alt="Profile" className="avatar-preview" />
                  ) : (
                    <span>Upload</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={mode === "signup" ? "Create Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {mode === "user" && (
            <p className="forgot-link" onClick={handleForgotPassword}>
              Forgot password?
            </p>
          )}

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : mode === "signup"
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <p className="signup-text">
          {mode === "user" ? (
            <>
              New user? <span onClick={() => setMode("signup")}>Sign up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("user")}>Login</span>
            </>
          )}
        </p>

        <p className="hint-a" onClick={() => navigate("/admin")}>
          Admin Login →
        </p>
      </div>
    </div>
  );
}

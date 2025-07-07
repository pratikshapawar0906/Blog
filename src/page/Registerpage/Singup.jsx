import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sign.css";
// import GoogleIcon from "../../../images/google.jpg";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../util";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !email || !password) {
      return handleError("Name, Email, and Password are required.");
    }

    try {
      const url = "http://localhost:7000/api/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      const { success, message } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("An error occurred while signing up. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <form className="Form" onSubmit={handleRegister}>
        {/* User Icon */}
        <div className="form-header">
          <i className="fa fa-user-circle user-icon"></i>
          <h2>Sign Up</h2>
        </div>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />

        {/* Password Field with Eye Icon */}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input password-input"
            required
          />
          <i
            className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} eye-icon`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
        <button type="submit" className="submit">
          Sign Up
        </button>
        <p className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
      {/* <button className="google-signup-btn">
        <img src={GoogleIcon} alt="Google" className="google-icon" />
        Continue with Google
      </button> */}
      <ToastContainer />
    </div>
  );
};

export default Signup;

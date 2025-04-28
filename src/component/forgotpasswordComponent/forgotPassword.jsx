import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../util";
import "./ForPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
  
    try {
      const url = "http://localhost:7000/api/forgot-password"; // Corrected URL
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json(); // Parse JSON response
      const { success, message } = result;
  
      if (success) {
        handleSuccess(message);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("An error occurred. Please try again.");
      console.error(error);
    }
  };
  

  return (
    <div className="forgot-password-container">
      <form className="Form" onSubmit={handleForgotPassword}>
        <div className="form-header">
          <h2>Forgot Password</h2>
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="submit">
          Send Reset Link
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;

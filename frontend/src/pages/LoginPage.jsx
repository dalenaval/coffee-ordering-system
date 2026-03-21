import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/userService";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = await loginUser(form);

      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-container">
        <div className="login-left">
          <div className="brand-badge">Web Ordering Platform</div>
          <h1 className="brand-title">Kape Nga Ni</h1>
          <p className="brand-description">
            Manage orders, products, and day-to-day café operations in one
            modern web-based platform.
          </p>
        </div>

        <div className="login-right">
          <form className="login-card" onSubmit={handleSubmit}>
            <div className="login-card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to Kape Nga Ni dashboard.</p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="login-footer">
              <Link to="/">← Back to Home</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

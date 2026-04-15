import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import loginBg from "../assets/login.jpg";


const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to access ICU monitoring</p>

        {/* EMAIL */}
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>📧</span>
          <input
            type="email"
            placeholder="Email address"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* PASSWORD */}
        <div style={styles.inputWrapper}>
          <span style={styles.icon}>🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* 👁️ Toggle */}
          <span
            style={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.linkText}>
          Don’t have an account?{" "}
          <Link to="/" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: `
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url(${loginBg})
  `,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "12px",
    width: "340px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
    color: "#000",
  },

  title: {
    marginBottom: "5px",
    color: "#222",
  },

  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },

  /* 🔥 INPUT WRAPPER */
  inputWrapper: {
    position: "relative",
    marginBottom: "15px",
  },

  icon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  input: {
    width: "80%",
    padding: "12px 35px", // space for icons
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "#000",
    background: "#fff",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  linkText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555",
  },

  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
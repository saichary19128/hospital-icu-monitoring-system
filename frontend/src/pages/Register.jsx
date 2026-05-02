import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import registerBg from "../assets/register.jpg";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("register");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
  });

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES (NO ALERTS)
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setMessage("");
    setError("");

    try {
      setLoading(true);
      await API.post("/auth/register", form);

      setMessage("✅ OTP sent to your email 📧");
      setStep("otp");

    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setMessage("");
    setError("");

    try {
      await API.post("/auth/verify-otp", {
        email: form.email,
        otp,
      });

      setMessage("✅ Verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch {
      setError("❌ Invalid OTP");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: "#040404" }}>Create Account 🏥</h2>

        {/* 🔥 MESSAGE UI */}
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* REGISTER STEP */}
        {step === "register" && (
          <>
            <input
              placeholder="Name"
              style={styles.input}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              style={styles.input}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              style={styles.input}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>

            <button style={styles.button} onClick={handleRegister} disabled={loading}>
              {loading ? "Processing..." : "Register"}
            </button>

            <p style={styles.linkText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            </p>
          </>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <>
            <p>
              Enter OTP sent to <b>{form.email}</b>
            </p>

            <input
              placeholder="Enter OTP"
              style={styles.input}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button style={styles.button} onClick={handleVerify}>
              Verify OTP
            </button>

            <p style={styles.linkText}>
              Already verified?{" "}
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            </p>
          </>
        )}
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
      url(${registerBg})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    background: "#f8f8f8",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  success: {
    color: "green",
    marginTop: "10px",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  },
  linkText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#090707",
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default Register;

// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../services/api";
// import registerBg from "../assets/register.jpg";

// const Register = () => {
//   const navigate = useNavigate();

//   const [step, setStep] = useState("register");

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "doctor",
//   });

//   const [otp, setOtp] = useState("");

//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     try {
//       setLoading(true);
//       await API.post("/auth/register", form);
//       alert("OTP sent to your email 📧");
//       setStep("otp");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Error");
//     }
//     finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify = async () => {
//     try {
//       await API.post("/auth/verify-otp", {
//         email: form.email,
//         otp,
//       });

//       alert("Verified successfully ✅");
//       navigate("/login");
//     } catch {
//       alert("Invalid OTP ❌");
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={{ color: "#040404" }}>Create Account 🏥</h2>

//         {/* 🔥 REGISTER STEP */}
//         {step === "register" && (
//           <>
//             <input
//               placeholder="Name"
//               style={styles.input}
//               onChange={(e) =>
//                 setForm({ ...form, name: e.target.value })
//               }
//             />

//             <input
//               placeholder="Email"
//               style={styles.input}
//               onChange={(e) =>
//                 setForm({ ...form, email: e.target.value })
//               }
//             />

//             <input
//               type="password"
//               placeholder="Password"
//               style={styles.input}
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
//             />

//             <select
//               style={styles.input}
//               onChange={(e) =>
//                 setForm({ ...form, role: e.target.value })
//               }
//             >
//               <option value="doctor">Doctor</option>
//               <option value="admin">Admin</option>
//             </select>

//             <button style={styles.button} onClick={handleRegister} disabled={loading}>
//               {loading ? <span className="loader"></span> : "Register"}
//             </button>

//             {/* 🔥 LOGIN LINK */}
//             <p style={styles.linkText}>
//               Already have an account?{" "}
//               <Link to="/login" style={styles.link}>
//                 Login
//               </Link>
//             </p>
//           </>
//         )}

//         {/* 🔥 OTP STEP */}
//         {step === "otp" && (
//           <>
//             <p>
//               Enter OTP sent to <b>{form.email}</b>
//             </p>

//             <input
//               placeholder="Enter OTP"
//               style={styles.input}
//               onChange={(e) => setOtp(e.target.value)}
//             />

//             <button style={styles.button} onClick={handleVerify}>
//               Verify OTP
//             </button>

//             {/* 🔥 LOGIN LINK ALSO HERE */}
//             <p style={styles.linkText}>
//               Already verified?{" "}
//               <Link to="/login" style={styles.link}>
//                 Login
//               </Link>
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: `
//     linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
//     url(${registerBg})
//   `,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   },
//   card: {
//     background: "#f8f8f8",
//     padding: "30px",
//     borderRadius: "12px",
//     width: "320px",
//     textAlign: "center",
//     color: "#d1c7c7",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     marginTop: "10px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     color: "#0e0d0d",
//   },
//   button: {
//     width: "100%",
//     padding: "10px",
//     marginTop: "15px",
//     background: "#28a745",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//   },
//   linkText: {
//     marginTop: "15px",
//     fontSize: "14px",
//     color: "#555",
//   },
//   link: {
//     color: "#007bff",
//     textDecoration: "none",
//     fontWeight: "bold",
//   },


// };

// export default Register;
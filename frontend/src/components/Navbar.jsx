import logo from "../assets/logo1.png";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.navbar}>
      {/* LEFT */}
      <div style={styles.left}>
        <span style={styles.logo}><img src={logo} alt="logo" style={{ height: "50px" }} /></span>
        <h2 style={styles.title}>Hospital ICU Monitoring</h2>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <span style={styles.user}>
          👨‍⚕️ {user?.name || "User"}
        </span>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          style={styles.button}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    width: "100vw",
    padding: "15px 60px",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    // 🔥 GLASS EFFECT
    background: "linear-gradient(180deg, #0038bb, #101720)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",

    // 🔥 SOFT BORDER + SHADOW
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",

    // 🔥 STICKY
    position: "sticky",
    top: 0,
    zIndex: 1000,

    boxSizing: "border-box",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logo: {
    fontSize: "24px",
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
  },

  right: {
    color: 'white',
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  user: {
    fontWeight: "500",
  },

  button: {
    background: "linear-gradient(135deg, #ff4d4d, #ff0000)",
    color: "white",
    padding: "8px 16px",
    border: "1px solid transparent",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;
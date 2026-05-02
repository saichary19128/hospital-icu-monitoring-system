const Loader = () => {
  return (
    <div style={styles.container}>
      <div style={styles.loaderBox}>

        {/* LOGO */}
        <img
          src="/src/assets/logo.png"
          alt="MedDev"
          style={styles.logo}
        />

        {/* ANIMATION */}
        <div style={styles.pulse}></div>

        {/* TEXT */}
        <h2 style={styles.text}>MedDev ICU Monitoring</h2>
        <p style={styles.subText}>Connecting to Live Stream...</p>

      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "white",
  },

  loaderBox: {
    textAlign: "center",
  },

  logo: {
    width: "80px",
    marginBottom: "20px",
    animation: "float 2s ease-in-out infinite",
  },

  pulse: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "4px solid #22c55e",
    margin: "0 auto",
    animation: "pulse 1.5s infinite",
  },

  text: {
    marginTop: "20px",
  },

  subText: {
    fontSize: "14px",
    color: "#aaa",
  },
};

export default Loader;
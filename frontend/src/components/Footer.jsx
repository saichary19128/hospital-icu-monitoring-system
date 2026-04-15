const Footer = () => {
  return (
    <div
      style={{
        padding: "12px",
        background: "#090808",
        borderTop: "1px solid #ddd",
        textAlign: "center",
        fontSize: "14px",
        color: "#555",
      }}
    >
      Hospital ICU Monitoring System © {new Date().getFullYear()}
      <p> All Rights Reserved by MedDev Team.</p>
    </div>
  );
};

export default Footer;
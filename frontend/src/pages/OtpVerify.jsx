import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const OtpVerify = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      await API.post("/auth/verify-otp", { email, otp });

      alert("Verified ✅");
      navigate("/login");
    } catch {
      alert("Wrong OTP ❌");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Verify OTP</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <br /><br />

      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default OtpVerify;
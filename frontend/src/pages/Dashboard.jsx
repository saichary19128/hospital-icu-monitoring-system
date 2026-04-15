import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import BedCard from "../components/BedCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dashboardBg from "../assets/dashboard1.jpg";


const Dashboard = () => {
  const [beds, setBeds] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [hospital, setHospital] = useState("");
  const [ocrData, setOcrData] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchBeds = useCallback(async () => {
    try {
      let url = "/beds";

      if (user.role === "admin" && hospital) {
        url += `?hospital=${hospital}`;
      }

      const res = await API.get(url);
      setBeds(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [hospital, user.role]);

  const fetchOCR = useCallback(async () => {
    try {
      const res = await API.get("/ocr");
      setOcrData(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchHospitals = useCallback(async () => {
    try {
      const res = await API.get("/hospitals");
      setHospitals(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchBeds();
    fetchOCR();

    const interval = setInterval(() => {
      fetchBeds();
      fetchOCR();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchBeds, fetchOCR]);
  useEffect(() => {
    fetchBeds();
    fetchHospitals();

    const interval = setInterval(fetchBeds, 2000);
    return () => clearInterval(interval);
  }, [hospital, fetchBeds, fetchHospitals]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        // 🔥 BACKGROUND IMAGE WITH OVERLAY
        background: `
          linear-gradient(rgba(2, 1, 1, 0.9), rgba(25, 21, 21, 0.9)),
          url(${dashboardBg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <div style={{ flex: 1, padding: "20px 40px" }}>
        <h2 style={{ color: "#eee4e4" }}>ICU Bed Monitoring</h2>

        {/* 🔥 ADMIN CONTROLS */}
        {user.role === "admin" && (
          <div style={{ marginTop: "10px" }}>
            <select
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              style={{
                padding: "6px",
                borderRadius: "5px",
                background: "white",
                border: "1px solid #ccc",
              }}
            >
              <option value="">All Hospitals</option>
              {hospitals.map((h) => (
                <option key={h._id} value={h.name}>
                  {h.name}
                </option>
              ))}
            </select>

            <button
              onClick={async () => {
                const name = prompt("Enter hospital name");
                if (!name) return;
                await API.post("/hospitals", { name });
                fetchHospitals();
              }}
              style={{
                marginLeft: "10px",
                padding: "6px 10px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              + Add Hospital
            </button>
          </div>
        )}

        {/* 🔥 BEDS GRID */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "20px",
          }}
        >

          {beds.map((bed) => (
            <BedCard
              key={bed._id}
              bed={bed}
              ocr={ocrData[bed.bedNumber] || {}}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
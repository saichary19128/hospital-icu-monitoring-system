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

  // 🔥 MODAL STATES
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);

  // 🔥 FORM STATES
  const [newHospital, setNewHospital] = useState("");
  const [bedForm, setBedForm] = useState({
    bedNumber: "",
    patientName: "",
    streamUrl: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔥 FETCH BEDS
  const fetchBeds = useCallback(async () => {
    try {
      let url = "/beds";
      if (hospital) {
        url += `?hospital=${hospital}`;
      }
      const res = await API.get(url);
      setBeds(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [hospital]);

  // 🔥 FETCH HOSPITALS
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
    fetchHospitals();

    const interval = setInterval(() => {
      fetchBeds();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchBeds, fetchHospitals]);

  // 🔥 ADD HOSPITAL
  const handleAddHospital = async () => {
    if (!newHospital) return alert("Enter hospital name");

    await API.post("/hospitals", { name: newHospital });

    setNewHospital("");
    setShowHospitalModal(false);
    fetchHospitals();
  };

  // 🔥 ADD BED
  const handleAddBed = async () => {
    if (!hospital) return alert("Select hospital first");

    const { bedNumber, patientName, streamUrl } = bedForm;

    if (!bedNumber || !patientName || !streamUrl) {
      return alert("Fill all fields");
    }

    await API.post("/beds", {
      bedNumber,
      patientName,
      streamUrl,
      hospital,
    });

    setBedForm({ bedNumber: "", patientName: "", streamUrl: "" });
    setShowBedModal(false);
    fetchBeds();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: `
          linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
          url(${dashboardBg})
        `,
        backgroundSize: "cover",
      }}
    >
      <Navbar />

      <div style={{ flex: 1, padding: "20px 40px" }}>
        <h2 style={{ color: "white" }}>ICU Bed Monitoring</h2>

        {/* 🔥 CONTROLS */}
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          {/* SELECT */}
          <select
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            style={{ padding: "6px", borderRadius: "5px" }}
          >
            <option value="">All Hospitals</option>
            {hospitals.map((h) => (
              <option key={h._id} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>

          {/* 🔥 SHOW ADD HOSPITAL ONLY IF NO HOSPITAL SELECTED */}
          {user.role === "admin" && !hospital && (
            <button
              onClick={() => setShowHospitalModal(true)}
              style={{
                background: "green",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
              }}
            >
              + Add Hospital
            </button>
          )}

          {/* 🔥 SHOW ADD BED ONLY IF HOSPITAL SELECTED */}
          {user.role === "admin" && hospital && (
            <button
              onClick={() => setShowBedModal(true)}
              style={{
                background: "#324dc7",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
              }}
            >
              + Add Bed
            </button>
          )}
        </div>

        {/* 🔥 BEDS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {beds.map((bed) => (
            <BedCard key={bed._id} bed={bed} />
          ))}
        </div>
      </div>

      <Footer />

      {/* 🔥 ADD HOSPITAL MODAL */}
      {showHospitalModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Add Hospital</h3>

            <input
              placeholder="Hospital name"
              value={newHospital}
              onChange={(e) => setNewHospital(e.target.value)}
              style={inputStyle}
            />

            <div style={btnRow}>
              <button onClick={handleAddHospital} style={greenBtn}>
                Add
              </button>
              <button
                onClick={() => setShowHospitalModal(false)}
                style={grayBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 ADD BED MODAL */}
      {showBedModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Add Bed ({hospital})</h3>

            <input
              placeholder="Bed Number"
              value={bedForm.bedNumber}
              onChange={(e) =>
                setBedForm({ ...bedForm, bedNumber: e.target.value })
              }
              style={inputStyle}
            />

            <input
              placeholder="Patient Name"
              value={bedForm.patientName}
              onChange={(e) =>
                setBedForm({ ...bedForm, patientName: e.target.value })
              }
              style={inputStyle}
            />

            <input
              placeholder="Stream URL"
              value={bedForm.streamUrl}
              onChange={(e) =>
                setBedForm({ ...bedForm, streamUrl: e.target.value })
              }
              style={inputStyle}
            />

            <div style={btnRow}>
              <button onClick={handleAddBed} style={blueBtn}>
                Add
              </button>
              <button
                onClick={() => setShowBedModal(false)}
                style={grayBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* 🔥 STYLES */
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalBox = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "300px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const btnRow = {
  marginTop: "15px",
  display: "flex",
  gap: "10px",
};

const greenBtn = {
  flex: 1,
  background: "green",
  color: "white",
  border: "none",
  padding: "8px",
};

const blueBtn = {
  flex: 1,
  background: "#007bff",
  color: "white",
  border: "none",
  padding: "8px",
};

const grayBtn = {
  flex: 1,
  background: "gray",
  color: "white",
  border: "none",
  padding: "8px",
};

export default Dashboard;

// import { useCallback, useEffect, useState } from "react";
// import API from "../services/api";
// import BedCard from "../components/BedCard";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import dashboardBg from "../assets/dashboard1.jpg";

// const Dashboard = () => {
//   const [beds, setBeds] = useState([]);
//   const [hospitals, setHospitals] = useState([]);
//   const [hospital, setHospital] = useState("");
//   const [ocrData, setOcrData] = useState({});

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // 🔥 FETCH BEDS
//   const fetchBeds = useCallback(async () => {
//     try {
//       let url = "/beds";

//       if (user.role === "admin" && hospital) {
//         url += `?hospital=${hospital}`;
//       }

//       const res = await API.get(url);
//       setBeds(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   }, [hospital, user.role]);

//   // 🔥 FETCH OCR (NO CACHE FIX)
//   const fetchOCR = useCallback(async () => {
//     try {
//       const res = await API.get(`/ocr?t=${Date.now()}`); // 🔥 important fix
//       setOcrData(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   }, []);

//   // 🔥 FETCH HOSPITALS
//   const fetchHospitals = useCallback(async () => {
//     try {
//       const res = await API.get("/hospitals");
//       setHospitals(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   }, []);

//   useEffect(() => {
//     console.log("Dashboard mounted");

//     API.get("/ocr")
//       .then(res => console.log("OCR WORKING:", res.data))
//       .catch(err => console.log("OCR ERROR:", err));
//   }, []);

//   // 🔥 SINGLE CLEAN EFFECT (NO DUPLICATES)
//   useEffect(() => {
//     fetchBeds();
//     fetchOCR();
//     fetchHospitals();

//     const interval = setInterval(() => {
//       fetchBeds();
//       fetchOCR();
//     }, 2000); // 🔥 live update

//     return () => clearInterval(interval);
//   }, [fetchBeds, fetchOCR, fetchHospitals]);
//   console.log("OCR data:", ocrData);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         background: `
//           linear-gradient(rgba(2,1,1,0.9), rgba(25,21,21,0.9)),
//           url(${dashboardBg})
//         `,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <Navbar />

//       <div style={{ flex: 1, padding: "20px 40px" }}>
//         <h2 style={{ color: "#eee4e4" }}>ICU Bed Monitoring</h2>

//         {/* 🔥 ADMIN CONTROLS */}
//         {user.role === "admin" && (
//           <div style={{ marginTop: "10px" }}>
//             <select
//               value={hospital}
//               onChange={(e) => setHospital(e.target.value)}
//               style={{
//                 padding: "6px",
//                 borderRadius: "5px",
//                 background: "white",
//                 border: "1px solid #ccc",
//               }}
//             >
//               <option value="">All Hospitals</option>
//               {hospitals.map((h) => (
//                 <option key={h._id} value={h.name}>
//                   {h.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={async () => {
//                 const name = prompt("Enter hospital name");
//                 if (!name) return;
//                 await API.post("/hospitals", { name });
//                 fetchHospitals();
//               }}
//               style={{
//                 marginLeft: "10px",
//                 padding: "6px 10px",
//                 background: "green",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//               }}
//             >
//               + Add Hospital
//             </button>
//           </div>
//         )}

//         {/* 🔥 BEDS GRID */}
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "12px",
//             marginTop: "20px",
//           }}
//         >
//           {beds.map((bed) => (
//             <BedCard
//               key={bed._id}
//               bed={bed}
//               ocr={ocrData[String(bed.bedNumber)] || {}} // 🔥 FIXED
//             />
//           ))}
//         </div>
//       </div>

//       <Footer />
//     </div>

//   );
// };

// export default Dashboard;
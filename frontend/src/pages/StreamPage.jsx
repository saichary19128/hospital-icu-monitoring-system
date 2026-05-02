import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

const StreamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bed, setBed] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 NEW

  const videoRef = useRef(null);

  const fetchBed = useCallback(async () => {
    try {
      const res = await API.get(`/beds/${id}`);
      setBed(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    fetchBed();
    const interval = setInterval(fetchBed, 2000);
    return () => clearInterval(interval);
  }, [fetchBed]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Bed {bed?.bedNumber} - Live Monitoring</h2>

        {/* 🔥 VIDEO CONTAINER */}
        <div style={styles.videoContainer}>

          {/* 🔥 LOADER */}
          {loading && (
            <div style={styles.loader}>
              {/* <img src={logo} alt="MedDev" style={styles.logo} /> */}
              <div style={styles.pulse}></div>
              <p style={styles.loadingText}>Connecting to Stream...</p>
            </div>
          )}

          {/* 🔥 BUTTONS */}
          <div style={styles.overlayControls}>
            <button style={styles.backBtn} onClick={handleBack}>
              ← Back
            </button>
          </div>

          {/* 🔥 STREAM */}
          {bed && (
            <iframe
              src={bed.streamUrl}
              title="Live Stream"
              allow="autoplay"
              style={{
                ...styles.video,
                opacity: loading ? 0 : 1, // 🔥 smooth reveal
              }}
              onLoad={() => setLoading(false)} // 🔥 KEY FIX
            />
          )}
        </div>

        {/* 🔥 INFO */}
        {bed && (
          <div style={styles.infoBox}>
            <p><b>Bed:</b> {bed.bedNumber}</p>
            <p><b>Status:</b> {bed.status}</p>
            <p><b>Camera:</b> {bed.cameraStatus}</p>

            {bed.cameraStatus === "online" && (
              <p style={styles.live}>● LIVE STREAM ACTIVE</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  videoContainer: {
    width: "100%",
    height: "70vh",
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    background: "black",
  },

  overlayControls: {
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    display: "flex",
    justifyContent: "space-between",
    zIndex: 10,
  },

  backBtn: {
    padding: "8px 15px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  video: {
    width: "100%",
    height: "100%",
    border: "none",
    transition: "opacity 0.5s ease", // 🔥 smooth fade
  },

  infoBox: {
    marginTop: "20px",
    textAlign: "center",
    padding: "15px",
    borderRadius: "10px",
    background: "rgba(7, 4, 4, 0.9)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "white",
  },

  live: {
    color: "lime",
    fontWeight: "bold",
    marginTop: "8px",
  },

  /* 🔥 LOADER STYLES */
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    color: "white",
  },

  logo: {
    width: "70px",
    marginBottom: "20px",
    animation: "float 2s ease-in-out infinite",
  },

  pulse: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "4px solid #22c55e",
    animation: "pulse 1.5s infinite",
  },

  loadingText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#ccc",
  },
};

export default StreamPage;

// import { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import Navbar from "../components/Navbar";

// const StreamPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [bed, setBed] = useState(null);
//   const videoRef = useRef(null);

//   const fetchBed = useCallback(async () => {
//     try {
//       const res = await API.get(`/beds/${id}`);
//       setBed(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchBed();
//     const interval = setInterval(fetchBed, 2000);
//     return () => clearInterval(interval);
//   }, [fetchBed]);

//   // const handleFullscreen = () => {
//   //   if (videoRef.current.requestFullscreen) {
//   //     videoRef.current.requestFullscreen();
//   //   }
//   // };

//   const handleBack = () => {
//     navigate("/dashboard"); // 🔥 safer
//   };

//   if (!bed) return <p>Loading...</p>;

//   return (
//     <div>
//       <Navbar />

//       <div style={{ padding: "20px" }}>
//         <h2>Bed {bed.bedNumber} - Live Monitoring</h2>

//         {/* 🔥 VIDEO CONTAINER */}
//         <div ref={videoRef} style={styles.videoContainer}>

//           {/* 🔥 BUTTONS (overlay) */}
//           <div style={styles.overlayControls}>
//             <button style={styles.backBtn} onClick={handleBack}>
//               ← Back
//             </button>
//             {/*
//             <button style={styles.fullBtn} onClick={handleFullscreen}>
//               🔳 Fullscreen
//             </button> */}
//           </div>

//           {/* 🔥 IFRAME (MAIN FIX HERE) */}
//           <iframe
//             src={bed.streamUrl}
//             title="Live Stream"
//             allow="autoplay"
//             style={styles.video}
//           />
//         </div>

//         {/* 🔥 INFO */}
//         <div style={styles.infoBox}>
//           <p><b>Bed:</b> {bed.bedNumber}</p>
//           <p><b>Status:</b> {bed.status}</p>
//           <p><b>Camera:</b> {bed.cameraStatus}</p>

//           {bed.cameraStatus === "online" && (
//             <p style={styles.live}>● LIVE STREAM ACTIVE</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   videoContainer: {
//     width: "100%",
//     height: "70vh",
//     position: "relative",
//     borderRadius: "10px",
//     overflow: "hidden",
//     background: "black",
//   },

//   overlayControls: {
//     position: "absolute",
//     top: "10px",
//     left: "10px",
//     right: "10px",
//     display: "flex",
//     justifyContent: "space-between",
//     zIndex: 10,
//   },

//   backBtn: {
//     padding: "8px 15px",
//     background: "rgba(0,0,0,0.6)",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },

//   fullBtn: {
//     padding: "8px 15px",
//     background: "rgba(0,0,0,0.6)",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },

//   video: {
//     width: "100%",
//     height: "100%",
//     border: "none",
//   },

//   infoBox: {
//     marginTop: "20px",
//     textAlign: "center",
//     padding: "15px",
//     borderRadius: "10px",
//     background: "rgba(7, 4, 4, 0.9)",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     maxWidth: "400px",
//     marginLeft: "auto",
//     marginRight: "auto",
//     color: "white",
//   },

//   live: {
//     color: "lime",
//     fontWeight: "bold",
//     marginTop: "8px",
//   },
// };

// export default StreamPage;
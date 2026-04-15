import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const StreamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bed, setBed] = useState(null);
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

  // const handleFullscreen = () => {
  //   if (videoRef.current.requestFullscreen) {
  //     videoRef.current.requestFullscreen();
  //   }
  // };

  const handleBack = () => {
    navigate("/dashboard"); // 🔥 safer
  };

  if (!bed) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Bed {bed.bedNumber} - Live Monitoring</h2>

        {/* 🔥 VIDEO CONTAINER */}
        <div ref={videoRef} style={styles.videoContainer}>

          {/* 🔥 BUTTONS (overlay) */}
          <div style={styles.overlayControls}>
            <button style={styles.backBtn} onClick={handleBack}>
              ← Back
            </button>
            {/* 
            <button style={styles.fullBtn} onClick={handleFullscreen}>
              🔳 Fullscreen
            </button> */}
          </div>

          {/* 🔥 IFRAME (MAIN FIX HERE) */}
          <iframe
            src={bed.streamUrl}
            title="Live Stream"
            allow="autoplay"
            style={styles.video}
          />
        </div>

        {/* 🔥 INFO */}
        <div style={styles.infoBox}>
          <p><b>Bed:</b> {bed.bedNumber}</p>
          <p><b>Status:</b> {bed.status}</p>
          <p><b>Camera:</b> {bed.cameraStatus}</p>

          {bed.cameraStatus === "online" && (
            <p style={styles.live}>● LIVE STREAM ACTIVE</p>
          )}
        </div>
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

  fullBtn: {
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
};

export default StreamPage;
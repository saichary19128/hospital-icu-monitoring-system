import { useNavigate } from "react-router-dom";

const BedCard = ({ bed, ocr }) => {
  const navigate = useNavigate();

  const getStyle = () => {
    if (bed.status === "critical") {
      return { border: "2px solid red", background: "#cd7777" };
    }
    if (bed.status === "stable") {
      return { border: "2px solid green", background: "#e6f9ec" };
    }
    return { border: "2px solid orange", background: "#fff7e6" };
  };

  return (
    <div
      onClick={() => navigate(`/stream/${bed._id}`)}
      style={{
        padding: "14px",
        borderRadius: "10px",
        width: "200px",
        cursor: "pointer",
        color: "black",
        ...getStyle(),
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Bed {bed.bedNumber}</h3>
        <span>{bed.cameraStatus === "online" ? "📶" : "❌"}</span>
      </div>

      {/* PATIENT */}
      <p><b>{bed.patientName}</b></p>

      {/* STATUS */}
      <p>
        {bed.status === "critical" && "🔴 Critical"}
        {bed.status === "stable" && "🟢 Stable"}
        {bed.status === "monitoring" && "🟡 Monitoring"}
      </p>

      {/* 🔥 OCR DATA (UPDATED) */}
      <p>❤️(HR): {ocr?.heartRate ?? "--"} bpm</p>
      <p>🩸(BP): {ocr?.bp ?? "--"}</p>
      <p>🫁(SPO2): {ocr?.spo2 ?? "--"}%</p>

      {/* CAMERA */}
      <p>Camera: {bed.cameraStatus}</p>

      {bed.cameraStatus === "online" && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ● LIVE
        </p>
      )}
    </div>
  );
};

export default BedCard;
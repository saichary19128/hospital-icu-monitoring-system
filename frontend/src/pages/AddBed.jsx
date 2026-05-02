import { useState } from "react";
import API from "../services/api";

const AddBed = () => {
  const [form, setForm] = useState({
    bedNumber: "",
    patientName: "",
    streamUrl: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/beds", form);

    alert("Bed Added!");
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h2>Add Bed</h2>

      <input
        placeholder="Bed Number"
        onChange={(e) =>
          setForm({ ...form, bedNumber: Number(e.target.value) })
        }
      />

      <input
        placeholder="Patient Name"
        onChange={(e) =>
          setForm({ ...form, patientName: e.target.value })
        }
      />

      <input
        placeholder="Stream URL"
        onChange={(e) =>
          setForm({ ...form, streamUrl: e.target.value })
        }
      />

      <button onClick={handleSubmit}>Add</button>
    </div>
  );
};

export default AddBed;
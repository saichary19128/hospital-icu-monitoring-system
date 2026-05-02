import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StreamPage from "./pages/StreamPage";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import ProtectedRoute from "./components/ProtectedRoute";
import AddBed from "./pages/AddBed";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/add-bed" element={<AddBed />} />
        <Route path="/" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stream/:id"
          element={
            <ProtectedRoute>
              <StreamPage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stream/:id" element={<StreamPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
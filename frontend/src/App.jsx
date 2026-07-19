import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateLeave from "./pages/employee/CreateLeave";
import MyLeaves from "./pages/employee/MyLeaves";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/employee/Dashboard";
import EditLeave from "./pages/employee/EditLeave";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
function App() {
  return (
    <>
      <ToastContainer position="top-right" />

      <Routes>

  <Route path="/" element={<Navigate to="/login" />} />

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/create-leave"
    element={
      <ProtectedRoute>
        <CreateLeave />
      </ProtectedRoute>
    }
  />

  <Route
    path="/my-leaves"
    element={
      <ProtectedRoute>
        <MyLeaves />
      </ProtectedRoute>
    }
  />

  <Route
    path="/edit-leave/:id"
    element={
      <ProtectedRoute>
        <EditLeave />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

</Routes>
    </>
  );
}

export default App;
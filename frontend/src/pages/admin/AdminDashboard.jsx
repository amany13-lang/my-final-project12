import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/admin/leaves");
      setLeaves(res.data);
    } catch (error) {
      toast.error("Failed to load leave requests");
    }
  };

  const approveLeave = async (id) => {
    try {
      await api.put(`/admin/leaves/${id}/approve`);
      toast.success("Leave approved successfully");
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const rejectLeave = async (id) => {
    try {
      await api.put(`/admin/leaves/${id}/reject`);
      toast.success("Leave rejected successfully");
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2 className="mb-4">Admin Dashboard</h2>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
              <th width="220">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.User?.name}</td>
                <td>{leave.User?.email}</td>
                <td>{leave.startDate.substring(0, 10)}</td>
                <td>{leave.endDate.substring(0, 10)}</td>
                <td>{leave.reason}</td>

                <td>
                  <span
                    className={`badge ${
                      leave.status === "approved"
                        ? "bg-success"
                        : leave.status === "rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => approveLeave(leave.id)}
                    disabled={leave.status !== "pending"}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => rejectLeave(leave.id)}
                    disabled={leave.status !== "pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
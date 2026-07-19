import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data);
    } catch (error) {
      toast.error("Failed to load leave requests");
    }
  };

  const deleteLeave = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this leave request?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/leaves/${id}`);

      toast.success("Leave deleted successfully");

      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2 className="mb-4">My Leave Requests</h2>

        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
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
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(`/edit-leave/${leave.id}`)
                    }
                    disabled={leave.status !== "pending"}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteLeave(leave.id)}
                    disabled={leave.status !== "pending"}
                  >
                    Delete
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
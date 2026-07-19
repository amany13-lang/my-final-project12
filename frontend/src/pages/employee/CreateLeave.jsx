import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

export default function CreateLeave() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/leaves", data);

      toast.success("Leave request submitted successfully");

      navigate("/my-leaves");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create leave request"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
          <h2 className="mb-4 text-center">Create Leave Request</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Start Date</label>

              <input
                type="date"
                className="form-control"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />

              {errors.startDate && (
                <small className="text-danger">
                  {errors.startDate.message}
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">End Date</label>

              <input
                type="date"
                className="form-control"
                {...register("endDate", {
                  required: "End date is required",
                })}
              />

              {errors.endDate && (
                <small className="text-danger">
                  {errors.endDate.message}
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Reason</label>

              <textarea
                className="form-control"
                rows="4"
                {...register("reason", {
                  required: "Reason is required",
                })}
              ></textarea>

              {errors.reason && (
                <small className="text-danger">
                  {errors.reason.message}
                </small>
              )}
            </div>

            <button className="btn btn-primary w-100">
              Submit Leave Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
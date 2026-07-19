import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

export default function EditLeave() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetchLeave();
  }, []);

  const fetchLeave = async () => {
    try {
      const res = await api.get(`/leaves/${id}`);

      setValue("startDate", res.data.startDate.substring(0, 10));
      setValue("endDate", res.data.endDate.substring(0, 10));
      setValue("reason", res.data.reason);
    } catch (error) {
      toast.error("Unable to load leave");
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.put(`/leaves/${id}`, data);

      toast.success("Leave updated successfully");

      navigate("/my-leaves");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <div className="card p-4 shadow mx-auto" style={{ maxWidth: "600px" }}>

          <h2 className="mb-4 text-center">
            Edit Leave
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-3">
              <label>Start Date</label>

              <input
                type="date"
                className="form-control"
                {...register("startDate")}
              />
            </div>

            <div className="mb-3">
              <label>End Date</label>

              <input
                type="date"
                className="form-control"
                {...register("endDate")}
              />
            </div>

            <div className="mb-3">
              <label>Reason</label>

              <textarea
                className="form-control"
                rows="4"
                {...register("reason")}
              />
            </div>

            <button className="btn btn-primary w-100">
              Update Leave
            </button>

          </form>

        </div>

      </div>
    </>
  );
}
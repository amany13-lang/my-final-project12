import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);

      toast.success("Registration successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Name"
              {...register("name", { required: true })}
            />
            {errors.name && <small className="text-danger">Name is required</small>}
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && <small className="text-danger">Email is required</small>}
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <small className="text-danger">Password is required</small>
            )}
          </div>

          <button className="btn btn-primary w-100">Register</button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
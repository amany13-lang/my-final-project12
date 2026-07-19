import Navbar from "../../components/layout/Navbar";
import StatsCard from "../../components/dashboard/StatsCard";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4">
          Employee Dashboard
        </h2>

        <div className="row">

          <StatsCard
            title="Total Leaves"
            value="5"
            color="primary"
          />

          <StatsCard
            title="Pending"
            value="2"
            color="warning"
          />

          <StatsCard
            title="Approved"
            value="3"
            color="success"
          />

        </div>

      </div>
    </>
  );
}
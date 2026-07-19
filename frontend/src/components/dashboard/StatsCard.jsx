export default function StatsCard({
  title,
  value,
  color,
}) {
  return (
    <div className="col-md-4 mb-4">
      <div className={`card border-${color}`}>
        <div className="card-body text-center">
          <h5>{title}</h5>

          <h2 className={`text-${color}`}>
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}
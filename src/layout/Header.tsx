export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container-fluid py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h5 m-0 fw-semibold" style={{ color: '#2e8987' }}>
            <i className="bi bi-shield-check me-2"></i>
            PrepperApp
          </h1>
          <div className="text-muted small">
            Household Preparedness Tracker
          </div>
        </div>
      </div>
    </header>
  );
}

// Halaman dashboard (halaman utama admin)
function Dashboard() {
  return (

     <div className="card p-4 shadow">

      {/* Header */}
      <div className="mb-4">
        <h2 style={{ color: "#000000" }}>Dashboard</h2>
        <p className="text-muted">
          Kelola data produk dan kategori
        </p>
      </div>

      {/* Statistik */}
      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm" style={{ borderRadius: "12px" }}>
            <h5>Total Produk</h5>
            <h3>3</h3>
            <p className="text-muted mb-0">Jumlah produk tersedia</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm" style={{ borderRadius: "12px" }}>
            <h5>Kategori</h5>
            <h3>2</h3>
            <p className="text-muted mb-0">Jumlah kategori</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm" style={{ borderRadius: "12px" }}>
            <h5>Produk Favorit</h5>
            <h3>3</h3>
            <p className="text-muted mb-0">Produk paling diminati</p>
          </div>
        </div>

      </div>

      {/* Ringkasan Produk */}
      <div className="card p-4 shadow-sm mt-4" style={{ borderRadius: "12px" }}>
        <h5 style={{ color: "#050505" }}>Ringkasan Produk</h5>

        <div className="mt-3">

          <div className="d-flex justify-content-between border-bottom py-2">
            <span>camera</span>
            <span>Rp 200.000</span>
          </div>

          <div className="d-flex justify-content-between border-bottom py-2">
            <span>Lighting</span>
            <span>Rp 125.000</span>
          </div>

          <div className="d-flex justify-content-between py-2">
            <span>Tenda</span>
            <span>Rp 250.000</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
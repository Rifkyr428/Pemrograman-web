// Import dari react-router-dom
// Outlet → tempat tampilkan halaman child
// NavLink → link dengan status aktif
// useNavigate → redirect
import { Outlet, NavLink, useNavigate } from "react-router-dom";

// Import hook React
// useEffect → jalan saat pertama render
// useState → state dinamis
import { useEffect, useState } from "react";

function AdminLayout() {

  // Navigasi
  const navigate = useNavigate();

  // State sidebar (mobile)
  const [showSidebar, setShowSidebar] = useState(false);

  // Cek login saat pertama render
  useEffect(() => {

    const isLogin = localStorage.getItem("isLogin");
     console.log("isLogin:", isLogin);
    // Jika belum login → kembali ke login
    if (isLogin !== "true") navigate("/");

  }, []);

  // Function logout
  const handleLogout = () => {

    // Hapus status login
    localStorage.removeItem("isLogin");

    // Redirect ke login
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* ================= SIDEBAR ================= */}
        <div
          className={`col-12 col-md-3 col-lg-2 bg-secondary text-white p-3 ${
            // Tampil/hide di mobile
            showSidebar ? "d-block" : "d-none d-md-block"
          }`}
          style={{ minHeight: "100vh"}}
        >
          <h4>Admin Rental Barang</h4>
            <p style={{ fontSize: "12px", opacity: "0.8" }}>
            Panel pengelolaan data
          </p>
          <hr />

          {/* Menu */}
          <ul className="nav flex-column">

            <li className="nav-item mb-2">
              <NavLink to="/admin" className="nav-link text-white">
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to="/admin/produk" className="nav-link text-white">
                Produk
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink to="/admin/kategori" className="nav-link text-white">
                Kategori
              </NavLink>
            </li>

          </ul>

          {/* Tombol logout */}
          <button
            onClick={handleLogout}
            className="btn btn-danger mt-3 w-100"
          >
            Logout
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="col-12 col-md-9 col-lg-10 p-3 bg-light">

          {/* Tombol mobile */}
          <div className="d-md-none mb-3">
            <button
              className="btn btn-primary"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              ☰ Menu
            </button>
          </div>

          {/* Tempat render halaman */}
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;
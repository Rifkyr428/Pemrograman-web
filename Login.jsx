// Import hook
// useState → untuk menyimpan data input
// useNavigate → untuk pindah halaman
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  // State username
  const [username, setUsername] = useState("");

  // State password
  const [password, setPassword] = useState("");

  // Hook navigasi
  const navigate = useNavigate();

  // Function ketika login
  const handleLogin = (e) => {
    e.preventDefault(); // mencegah reload

    // Validasi login sederhana
    if (username === "admin" && password === "admin") {

      // Simpan status login
      localStorage.setItem("isLogin", true);

      // Pindah ke halaman admin
      navigate("/admin");

    } else {
      // Jika gagal
      alert("Login gagal!");
    }
  };

  return (
    // Container full layar + center
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-secondary">

      {/* Card login */}
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>

        {/* Judul */}
        <h3 className="text-center mb-4">Login Admin</h3>

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Input Username */}
          <div className="mb-3">
            <label>Username</label>

            <input
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Input Password */}
          <div className="mb-3">
            <label>Password</label>

            <input
              type="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Tombol login */}
          <button className="btn btn-dark w-100">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
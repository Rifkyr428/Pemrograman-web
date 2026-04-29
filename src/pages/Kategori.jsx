import { useEffect, useState } from "react";
// useState digunakan untuk menyimpan data state pada komponen
// useEffect digunakan untuk menjalankan fungsi saat komponen pertama kali dimuat;
import axios from "axios";
// Axios digunakan untuk melakukan request ke backend API (GET, POST, dll)
import Swal from "sweetalert2";
// SweetAlert2 digunakan untuk menampilkan notifikasi popup seperti sukses, error, atau peringatan

function Kategori() {
  const [data, setData] = useState([]);
  // Menyimpan data kategori yang diambil dari database
  const [nama, setNama] = useState("");
  // Menyimpan input nama kategori dari form
  const [editId, setEditId] = useState(null);
  // Menyimpan id kategori yang sedang diedit
  const [hapusId, setHapusId] = useState(null);
  // Menyimpan id kategori yang akan dihapus

  const API = "http://localhost/backend-pemrograman-web";
  // URL utama backend PHP yang digunakan sebagai API

  const getData = () => {
    axios.get(`${API}/get_kategori.php`).then((res) => setData(res.data));
    // Mengambil data dari backend dan menyimpannya ke state data
  };

  useEffect(() => {
    getData();
    // Menjalankan getData saat halaman pertama kali dibuka
  }, []);

  const handleTambah = () => {
    axios
      .post(`${API}/tambah_kategori.php`, {
        nama_kategori: nama,
      })
      .then(() => {
        setNama("");
        // Mengosongkan input setelah data ditambahkan
        getData();
        // Mengambil ulang data setelah insert
        if (!nama) {
          Swal.fire({
            icon: "warning",
            title: "Oops!",
            text: "Nama kategori tidak boleh kosong",
          });
          return;
        }
        // Validasi jika input kosong
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kategori berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });
        // Notifikasi sukses tambah data
      });
  };

  const handleEdit = (item) => {
    setNama(item.nama_kategori);
    // Mengisi input dengan data lama
    setEditId(item.id);
    // Menyimpan id data yang akan diedit
  };

  const handleUpdate = () => {
    axios
      .post(`${API}/edit_kategori.php`, {
        id: editId,
        nama_kategori: nama,
      })
      .then(() => {
        setNama("");
        setEditId(null);
        // Reset form setelah update
        getData();
        // Refresh data setelah update
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kategori berhasil diupdate",
          timer: 1500,
          showConfirmButton: false,
        });
        // Notifikasi update berhasil
      });
  };
  const handleDelete = () => {
    axios
      .post(`${API}/hapus_kategori.php`, {
        id: hapusId,
      })
      .then(() => {
        setHapusId(null);
        // Reset id setelah delete
        getData();
        // Refresh data setelah delete
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kategori berhasil dihapus",
          timer: 1500,
          showConfirmButton: false,
        });
        // Notifikasi delete berhasil
      });
  };

  return (
    <div className="card p-4 shadow">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Kategori</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalForm"
          onClick={() => {
            setNama("");
            setEditId(null);
          }}
        >
          + Tambah
        </button>
      </div>
      <div className="table-responsive">
        <table className="table mt-3">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_kategori}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#modalForm"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#modalHapus"
                    onClick={() => setHapusId(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal fade" id="modalForm">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editId ? "Edit" : "Tambah"} Kategori
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Nama kategori"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Batal
              </button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={editId ? handleUpdate : handleTambah}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="modalHapus">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Konfirmasi Hapus</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Yakin ingin menghapus data ini?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Batal
              </button>
              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Kategori;
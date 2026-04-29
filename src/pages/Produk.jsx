// ======================= IMPORT =======================
import { useEffect, useState, lazy, Suspense } from "react"; //hook reqct
import axios from "axios";  // request API
import Swal from "sweetalert2"; // alert popup

//lazy loading editor biar ringan
const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css"; // import css editor

// ======================= COMPONENT =======================
function Produk() {

  // ======================= STATE =======================
  const [showEditor, setShowEditor] = useState(false); // kontrol editor
  const [data, setData] = useState([]); // data produk
  const [kategori, setKategori] = useState([]); // data kategori

  //input form
  const [idKategori, setIdKategori] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [fileFoto, setFileFoto] = useState(null);
  const [preview, setPreview] = useState(""); // preview gambar
  const [deskripsi, setDeskripsi] = useState("");
  
  const [editingId, setEditingId] = useState(null); // id produk yang sedang diedit
  const [hapusId, setHapusId] = useState(null); // id produk yang akan dihapus

  const API = "http://localhost/backend-pemrograman-web"; // URL backend API

  // ======================= Get Data =======================
  const getData = async () => {
    axios.get(`${API}/get_produk.php`)
      .then(res =>  setData(res.data));
  };

  const getKategori = async () => {
    axios.get(`${API}/get_kategori.php`)
      .then(res =>  setKategori(res.data));
  };
  // ======================= useEffect =======================
   useEffect(() => {
    getData();
    getKategori();

    // ambil modal bootstrap
    const modal = document.getElementById("modalForm");

    // saat modal dibuka -> tampilkan editor
    const handleShow = () => setShowEditor(true);

    // saat modal ditutup -> reset editor
    const handleHide = () => {
      setShowEditor(false);
      setPreview(""); // Reset preview gambar
    };
   
    if (modal) {
    modal.addEventListener("show.bs.modal", handleShow);
    modal.addEventListener("hidden.bs.modal", handleHide);
    }

    // Clean up 
    return () => {
      if (modal) {
      modal.removeEventListener("show.bs.modal", handleShow);
      modal.removeEventListener("hidden.bs.modal", handleHide);
      }
    };
  }, []);

  // ======================= RESET  =======================
  const resetForm = () => {
    setEditingId(null);
    setIdKategori("");
    setNamaProduk("");
    setHarga("");
    setStok("");
    setFileFoto(null);
    setPreview(null);
    setDeskripsi("");
  };

  // ======================= FILE  =======================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileFoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Preview gambar
    }
  };

  // ======================= VALIDASI  =======================
  const validasi = () => {
    if (!namaProduk || !harga || !stok || !idKategori) {
      Swal.fire("Oops!", "Semua field wajib diisi!", "warning");
      return false;
    }
    return true;
  };

  // ======================= TAMBAH  =======================
  const handleTambah = () => {

    if (!validasi()) return;

    if (!fileFoto) {
      Swal.fire("Oops!", "Foto produk wajib diupload!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("id_kategori", idKategori);
    formData.append("nama_produk", namaProduk);
    formData.append("harga", harga);
    formData.append("stok", stok);
    formData.append("deskripsi", deskripsi);
    formData.append("foto", fileFoto);

    axios.post(`${API}/add_produk.php`, formData)
      .then(() => {
        resetForm();
        getData();
        Swal.fire("Berhasil!", "Produk berhasil ditambahkan!", "success");
      });
  };

  // ======================= EDIT  =======================
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingId(item.id_produk);
    setIdKategori(item.id_kategori);
    setNamaProduk(item.nama_produk);
    setHarga(item.harga);
    setStok(item.stok);
    setDeskripsi(item.deskripsi);
    
    // Tampilkan foto lama sebagai preview
    setPreview(`${API}/uploads/${item.foto}`);

    // refresh editor
    setShowEditor (false);
    setTimeout(() => setShowEditor(true), 50);
  };

  // ======================= UPDATE  =======================
  const handleUpdate = () => {

    if (!validasi()) return;

    const formData = new FormData();  
    formData.append("id", editingId);
    formData.append("id_kategori", idKategori);
    formData.append("nama_produk", namaProduk);
    formData.append("harga", harga);
    formData.append("stok", stok);
    formData.append("deskripsi", deskripsi);

    if (fileFoto) {
      formData.append("foto", fileFoto);
    }

    axios.post(`${API}/edit_produk.php`, formData)
      .then(() => {
        resetForm();
        getData();
        Swal.fire("Berhasil!", "Produk berhasil diupdate!", "success");
      });
  };

  // ======================= DELETE  =======================
  const handleDelete = () => {
    axios.post(`${API}/hapus_produk.php`, 
      { id: hapusId 
    }).then(() => {
      setHapusId(null);
      getData();
      Swal.fire("Berhasil!", "Produk berhasil dihapus!", "success");
    });
  };

  // ======================= UI =======================
  return (
    <div className="card p-4 shadow">

      {/* Header */}
      <div className="d-flex justify-content-between">
        <h2>Produk</h2>

        {/* Button Tambah */}
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalForm"
          onClick={() => {
            resetForm();
            setShowEditor(false);
          }}
        >
          +Tambah
        </button>
      </div>

      {/* Table */}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama </th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Foto</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={item.id}>
              <td>{i + 1}</td>
              <td>{item.nama_produk}</td>
              <td>{item.nama_kategori}</td>
              <td>{item.harga}</td>
              <td>{item.stok}</td>
              {/*gambar produk*/}
              <td>
                <img
                  src={`http://localhost/backend-pemrograman-web/${item.foto}`}
                  widht="60"
                  alt=""
                />
              </td>

              {/* tombol aksi edit & hapus */}
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalForm"
                  onClick={() => handleEdit(item)}>
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#modalHapus"
                  onClick={() => {setHapusId(item.id)}}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form*/}
      <div className="modal fade" id="modalForm">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
          
          {/* Modal Header */}
          <div className="modal-header">
            <h5>{editingId ? "Edit Produk" : "Tambah"}</h5>
            </div>

            {/* Modal Body */}
            <div className="modal-body">

             {/*dropdown kategori */}
             <select className="form-control mb-2"
              value={idKategori}
              onChange={(e) => setIdKategori(e.target.value)}>
                <option value="">--Pilih Kategori--</option>
                {kategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>

              {/*input nama produk */}
              <input className="form-control mb-2"
                placeholder="Nama Produk"
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}/>

              {/*input harga */}
              <input className="form-control mb-2"
                placeholder="Harga"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}/>

                {/*input stok */}
              <input className="form-control mb-2"
                placeholder="Stok"
                value={stok}
                onChange={(e) => setStok(e.target.value)}/>

                {/*upload file */}
              <input className="form-control mb-2"
                type="file"
                onChange={handlefileChange}/>

              {/* preview gambar */}
              {preview && (
                <img src={preview} width="100" alt="" className="mb-2"/>
              )}

              {/*editor text*/  }
              {showEditor && (
                <Suspense fallback={<div>Loading ...</div>}>
                  <ReactQuill
                  key={editingId || "new"}
                  theme="snow"
                  value={deskripsi}
                  onChange={setDeskripsi}
                  />
                </Suspense>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Batal
              </button>
              
              {/* tombol simpan */}
              <button className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={editingId ? handleUpdate : handleTambah}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hapus */}
      <div className="modal fade" id="modalHapus">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-body">
              yakin hapus produk?
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Batal
            </button>
            <button className="btn btn-danger"
            data-bs-dismiss="modal" 
            onClick={handleDelete}>
              Hapus
            </button>
          </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Produk;
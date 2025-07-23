import Swal from "sweetalert2";

export const handleLogout = (navigate, role) => {
  // Hapus token dari localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("bangsal");

  // Tampilkan notifikasi logout berhasil
  Swal.fire({
    icon: "success",
    title: "Logout berhasil!",
    timer: 2000,
    showConfirmButton: false,
    position: "center",
  });

  if(role == "admin"){
    navigate("/admin/login");
  }else{
    navigate("/login");
  }
  
};

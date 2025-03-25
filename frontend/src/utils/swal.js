import Swal from "sweetalert2";

const swal = {
  success: (message) => Swal.fire("Success", message, "success"),
  error: (message) => Swal.fire("Error", message, "error"),
};

export default swal;

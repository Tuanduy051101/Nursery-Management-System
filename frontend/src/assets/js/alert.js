import Swal from "sweetalert2";
import MailService from "../../services/mail.service";

export const alert_success = (title, text) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #fff";
    },
  });
};

export const alert_warning = (title, text) => {
  Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #fff";
    },
  });
};

export const alert_error = (title, text) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #fff";
    },
  });
};

export const alert_info = (title, text) => {
  Swal.fire({
    icon: "info",
    title: title,
    text: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #fff";
    },
  });
};

// alert response

export const alert_delete = async (title, text) => {
  let isConfirmed = false;
  await Swal.fire({
    icon: "question",
    title: title,
    html: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #fff";
    },
    showCancelButton: true,
    showConfirmButton: true,
    reverseButtons: true,
  }).then((result) => {
    isConfirmed = result.isConfirmed;
  });
  return isConfirmed;
};

export const alert_delete_wide = async (title, text) => {
  let isConfirmed = false;
  await Swal.fire({
    icon: "question",
    title: title,
    html: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #fff";
    },
    showCancelButton: true,
    showConfirmButton: true,
    reverseButtons: true,
    customClass: {
      container: "wide-dialog-container",
      popup: "wide-dialog-popup",
      content: "wide-dialog-content",
    },
  }).then((result) => {
    isConfirmed = result.isConfirmed;
  });
  return isConfirmed;
};

//notification
export const alert_noti = (title, text) => {
  const formattedText = text.replace(/\n/g, "<br>");
  Swal.fire({
    icon: "info",
    title: title,
    html: `<div style="line-height:30px;text-align:center;">${formattedText}</div>`,
    background: "#fff",
    width: 700,
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #fff";
    },
  });
};

export const alert_input_text = async (title) => {
  let content = "";
  await Swal.fire({
    title: title,
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Thêm",
    preConfirm: (inputValue) => {
      if (inputValue.trim() === "") {
        Swal.showValidationMessage("Vui lòng nhập đủ thông tin.");
      }
      return inputValue;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      content = result.value;
    }
  });
  return content;
};


import Swal from "sweetalert2";

const object_alert = (title, text, html, icon) => {
    return {
        icon: icon,
        title: title,
        text: text,
        html: html,
        showCloseButton: true,
        timer: 2000,
        customClass: {
            container: "custom-alert",
        },
    }
}

export const alert_error = (title = '', text = '', html = '') => {
    return object_alert(title, text, html, 'error');
}

export const alert_warning = (title = '', text = '', html = '') => {
    return object_alert(title, text, html, 'warning');
}

export const alert_success = (title = '', text = '', html = '') => {
    return object_alert(title, text, html, 'success');
}

const alertAll = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        width: "500px",
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
        didClose: () => {
            // console.log('Thông báo đã đóng');
            // if (alert) {
            //     notificationQueue.push(alert);
            //     alert = false;
            // }
        },
    });
    const nextNotification = () => {
        let notificationQueue = JSON.parse(sessionStorage.getItem("notificationQueue")) || [];
        if (notificationQueue.length > 0) {
            const notification = notificationQueue.shift();
            Toast.fire(notification).then(() => {
                sessionStorage.setItem(
                    "notificationQueue",
                    JSON.stringify(notificationQueue)
                );
                nextNotification();
            })
        }
    }
    nextNotification();
}

export const run_alert = async (alert) => {
    let notificationQueue =
        JSON.parse(sessionStorage.getItem("notificationQueue")) || [];
    notificationQueue.push(alert);
    sessionStorage.setItem(
        "notificationQueue",
        JSON.stringify(notificationQueue)
    );
    alertAll();
}

export const alert_input_1 = async (type = 'text', title = '', inputLabel = '', message = 0) => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        showCloseButton: true,
        width: "500px",
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
        didClose: () => {
            console.log('Thông báo đã đóng');
        },
    });

    const result = await Swal.fire({
        title: title,
        input: type,
        inputLabel: inputLabel == 'Enter the number of records per page.' ? 'Nhập số lượng bản ghi trên mỗi trang' : inputLabel,
        inputAttributes: {
            autocomplete: 'off',
        },
        showConfirmButton: true,
        confirmButtonColor: 'blue',
        inputValidator: (value) => {
            if (!value) {
                return 'Thiếu trường bắt buộc.';
            }
        }
    });

    if (result.isConfirmed) {
        Toast.fire({
            icon: 'success',
            title: message || `Bạn đã nhập: ${result.value}`,
            timer: 2000,
        });
    }
    return result.value < 0 ? result.value * -1 : result.value || 1;
}

export const alert_remove = async (itemsToDelete, fields, labels, width = '40%') => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        showCloseButton: true,
        width: "500px",
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
        didClose: () => {
            console.log('Thông báo đã đóng');
        },
    });
    const result = await Swal.fire({
        title: 'Bạn có chắc chắn muốn xoá?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, xoá nó đi!',
        cancelButtonText: 'Huỷ',
        width: width,
        html: `
              <table class="border-collapse w-full table-auto">
                <thead>
                  <tr class="border border-solid border-slate-600 mx-1">
                  <th class="p-2">Stt</th>
                  ${fields.map(field => `
                    <th class="p-2">${field}</th>
                  `)}
                  </tr>
                </thead>
                <tbody>
                  ${itemsToDelete.map((item, index) => `
                    <tr class="border border-solid border-slate-600">
                      <td class="p-2">${index + 1}</td>
                      ${labels.map(label => `
                        <td class="p-2">${item[label]}</td>
                      `)}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `,
    });
    return result.isConfirmed;
}
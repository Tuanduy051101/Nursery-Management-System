import Swal from "sweetalert2";

const object_alert = (title, text, html, icon) => {
    return {
        icon: icon,
        title: title,
        text: text,
        html: html,
        showCloseButton: true,
        timer: 5000,
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
    });
    const nextNotification = () => {
        let notificationQueue = JSON.parse(sessionStorage.getItem("notificationQueue")) || [];
        if (notificationQueue.length > 0) {
            const notification = notificationQueue.shift();
            console.log(notification);
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
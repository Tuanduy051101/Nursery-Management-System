export const formatDate = (value) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${day}-${month}-${year}`;
}

export const formatDateReverse = (value = new Date()) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
}

export const formatDateTime = (value) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(), hours = date.getHours(), minutes = date.getMinutes();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    return `${hours} giờ ${minutes} phút, ngày ${day}-${month}-${year}`;
}

export const formatDateTime_2 = (value) => {
    const start_time = value.split(" to ")[0];
    const end_time = value.split(" to ")[1];
    return [formatDateTime(start_time), formatDateTime(end_time)].join(" đến ");
}

export const format_input = (value) => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// console.log(formatDateTime_2('2023-07-04t15:01 to 2023-07-06t15:01'))

export const getpreviousDate = (date) => {
    var currentDate = new Date();
    var previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    return `${previousDay.getFullYear()}-${(previousDay.getMonth() + 1).toString().padStart(2, '0')}-${previousDay.getDate().toString().padStart(2, '0')}`;
}

export const excelNumberToDate = (excelNumber) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    const dateInMilliseconds = excelEpoch.getTime() + excelNumber * millisecondsPerDay;
    const formattedDate = new Date(dateInMilliseconds).toISOString().slice(0, 10);

    return formattedDate;
}

export const calculateAgeInMonths = (birthDate) => {
    // Tính thời gian giữa ngày sinh và ngày hiện tại
    const currentDate = new Date();
    const diffInMilliseconds = currentDate - birthDate;

    // Chuyển thời gian từ mili giây sang tháng
    const millisecondsInMonth = 1000 * 60 * 60 * 24 * 30.44; // 1 tháng có khoảng 30.44 ngày
    const ageInMonths = diffInMilliseconds / millisecondsInMonth;

    // Làm tròn số tháng và trả về kết quả
    return Math.floor(ageInMonths);
}
function formatDate(rawDate: string) {
    // format date so it matches russian format
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1);  // getMonth() returns number from 0 to 11
    let day = String(date.getDate());

    if (month.length === 1) month = '0' + month; // if there is only one digit, append 0
    if (day.length === 1) day = '0' + day; // if there is only one digit, append 0

    return `${day}.${month}.${year}`;
}

export default formatDate;
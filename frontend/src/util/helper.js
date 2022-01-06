let d = new Date();
let days = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
let months = ['Jan', 'Feb', 'Maart', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

let datum = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()].toUpperCase()}`;

export default datum;

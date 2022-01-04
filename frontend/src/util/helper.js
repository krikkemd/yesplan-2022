let d = new Date();
let days = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
let months = [
  'Januari',
  'Februari',
  'Maart',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Augustus',
  'September',
  'Oktober',
  'November',
  'December',
];

let datum = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()].toUpperCase()}`;

export default datum;

import '../css/colors.css';

const Colors = () => {
  const handleClick = e => {
    e.target.classList.contains('text-black')
      ? e.target.classList.remove('text-black')
      : e.target.classList.add('text-black');
    console.log(e.target);
  };

  const colors = [
    { text: 'Aubergine', value: '#542549' },
    { text: 'Blauw', value: '#008abb' },
    { text: 'Cyaan', value: '#57ceca' },
    { text: 'Geel', value: '#f3df2f' },
    { text: 'Grijsgroen', value: '#a5bdac' },
    { text: 'Groenblauw', value: '#009b8e' },
    { text: 'Groen licht', value: '#c2d886' },
    { text: 'Oranje donker', value: '#f18705' },
    { text: 'Oranje licht', value: '#f4a900' },
    { text: 'Paars', value: '#4e2a96' },
    { text: 'Paars donker', value: '#2a1d48' },
    { text: 'Paars licht', value: '#634a97' },
    { text: 'Paars roze', value: '#9e2558' },
    { text: 'Roze', value: '#e06179' },
    { text: 'Zalm', value: '#e69282' },
  ];
  return (
    <div className='parent'>
      {colors.map((color, i) => (
        <div
          onClick={handleClick}
          key={color.value}
          className={'child text-white'}
          style={{ backgroundColor: color.value }}>
          <span>{color.text}</span>
        </div>
      ))}
    </div>
  );
};

export default Colors;

import '../css/colors.css';

const Colors = () => {
  const colors = [
    { name: 'Aubergine', hex: '#542549' },
    { name: 'Blauw', hex: '#008abb' },
    { name: 'Cyaan', hex: '#57ceca' },
    { name: 'Geel', hex: '#f3df2f' },
    { name: 'Grijsgroen', hex: '#a5bdac' },
    { name: 'Groenblauw', hex: '#009b8e' },
    { name: 'Groen licht', hex: '#c2d886' },
    { name: 'Oranje donker', hex: '#f18705' },
    { name: 'Oranje licht', hex: '#f4a900' },
    { name: 'Paars', hex: '#4e2a96' },
    { name: 'Paars donker', hex: '#2a1d48' },
    { name: 'Paars licht', hex: '#634a97' },
    { name: 'Paars roze', hex: '#9e2558' },
    { name: 'Roze', hex: '#e06179' },
    { name: 'Zalm', hex: '#e69282' },
  ];
  return (
    <div className='parent'>
      {colors.map(color => (
        <div key={color.hex} className='child' style={{ backgroundColor: color.hex }}>
          <span>{color.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Colors;

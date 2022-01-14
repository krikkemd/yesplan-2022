import { useState } from 'react';
import '../css/colors.css';
import '../css/interact.css';
import '../util/interact';
import 'semantic-ui-css/semantic.min.css';
import { Dropdown, Button } from 'semantic-ui-react';

const Colors = () => {
  let [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  const options = [
    { key: 1, text: 'Choice 1', value: 1 },
    { key: 2, text: 'Choice 2', value: 2 },
    { key: 3, text: 'Choice 3', value: 3 },
  ];
  // const handleClick = e => {
  //   e.target.classList.contains('text-black')
  //     ? e.target.classList.remove('text-black')
  //     : e.target.classList.add('text-black');
  //   console.log(e.target);
  // };

  const addElement = e => {
    console.log('click');
    setCount(++count);
    setItems([...items, `color-${count}`]);
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
      <div style={{ width: '100%', height: '100%', border: '1px solid black' }}>
        {items.map(val => (
          <div className='resize-drag'>{val}</div>
        ))}
      </div>

      {/* {colors.map((color, i) => (
        <div
          key={color.value}
          // className={'child text-white'}
          className='resize-drag text-white child'
          style={{ backgroundColor: color.value }}>
          <span>{color.text}</span>
        </div>
      ))} */}

      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '25%',
          border: '1px solid blue',
          justifyContent: 'flex-start',
        }}>
        <Button onClick={addElement}>add one</Button>
        <Dropdown clearable options={colors} selection />
        <Dropdown clearable options={colors} selection />
      </aside>
    </div>
  );
};

export default Colors;

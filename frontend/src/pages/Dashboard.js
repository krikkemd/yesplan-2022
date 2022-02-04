import { useEffect, useState } from 'react';
import '../css/interact.css';
import '../util/interact';
import 'semantic-ui-css/semantic.min.css';
import '../css/dashboard.css';
import { Button, Form } from 'semantic-ui-react';

const DashBoard = () => {
  let [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  let [text, setText] = useState('');
  let [fontSize, setFontSize] = useState();
  const [colorOne, setColorOne] = useState('');
  const [target, setTarget] = useState();

  useEffect(() => {
    if (target) {
      setFontSize(`${parseInt(target.style.fontSize) || ''}`);
    }
  }, [target]);

  const handleChange = e => {
    console.log(e);
    console.log(e.target.innerText);
    setColorOne(colors.filter(color => color.text === e.target.innerText && color.value));
  };

  const handleChangeText = e => {
    console.log(e.target.value);
    setText(e.target.value);
  };

  const addColorElement = e => {
    if (colorOne) {
      console.log(colorOne);
      setCount(++count);
      setItems([
        ...items,
        {
          hex: colorOne[0].value,
          id: `test${count}`,
          name: colorOne[0].text,
          text: text,
          fontSize: 28,
        },
      ]);
      setText('');
      console.log(items);
    }
  };

  const removeColorElement = (e, id) => {
    e.currentTarget.parentNode.classList.add('hidden');
    let filteredItems = items.filter(item => item.id !== id);
    setItems(filteredItems);
  };

  const increaseFontSize = targetEl => {
    // console.log(targetEl);
    if (targetEl) {
      targetEl.style.fontSize = `${parseInt(targetEl.style.fontSize) + 1}px`;
      setFontSize(`${parseInt(targetEl.style.fontSize)}`);
    }
  };

  const decreaseFontSize = targetEl => {
    if (targetEl) {
      targetEl.style.fontSize = `${parseInt(targetEl.style.fontSize) - 1}px`;
      setFontSize(`${parseInt(targetEl.style.fontSize)}`);
    }
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
    <div className='container'>
      <div style={{ width: '100%', height: '100%', borderRight: '1px solid #ddd' }}>
        {items.map((val, i) => {
          return (
            <div
              key={`${val.name}-${i}`}
              id={`${val.name}-${i}`}
              onClick={e => {
                setTarget(e.target);
                setFontSize(`${parseInt(e.currentTarget.style.fontSize)}`);
              }}
              className={`resize-drag tap-target div__color class-${i}`}
              style={{ backgroundColor: items[i].hex, fontSize: val.fontSize }}>
              <Button
                onClick={e => {
                  removeColorElement(e, i);
                }}
                className='button__close'
                icon='close'
                size='mini'
              />
              {items[i].text || items[i].name}
            </div>
          );
        })}
      </div>

      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '25%',
          justifyContent: 'flex-start',
        }}>
        <Form>
          <Form.Select
            fluid
            label='Kleur'
            onChange={handleChange}
            options={colors}
            placeholder='Kleur'
          />
          <Form.Input
            fluid
            label='Tekst'
            value={text}
            onChange={handleChangeText}
            placeholder='tekst'
          />
          <Form.Group inline>
            <Form.Button
              label='Lettertype'
              icon='angle up'
              onClick={() => {
                increaseFontSize(target);
              }}
            />
            <Form.Button
              icon='angle down'
              onClick={() => {
                decreaseFontSize(target);
              }}
            />
            <span>{fontSize && `${fontSize}px`}</span>
          </Form.Group>
          <Form.Button onClick={addColorElement}>Submit</Form.Button>
        </Form>
      </aside>
    </div>
  );
};

export default DashBoard;

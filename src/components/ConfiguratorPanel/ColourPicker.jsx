import styles from './ColourPicker.module.css'

const COLOURS = [
  { name: 'white', hex: '#ffffff' },
  { name: 'green', hex: '#a8c99a' },
  { name: 'blue',  hex: '#8fb8d9' },
  { name: 'teal',  hex: '#4f8f7f' },
]

export default function ColourPicker({ value, onChange }) {
  return (
    <div className={styles.picker}>
      <h3>Colour</h3>
      <div className={styles.swatches}>
        {COLOURS.map((c) => (
          <button
            key={c.name}
            className={`${styles.swatch} ${value === c.name ? styles.selected : ''}`}
            style={{ backgroundColor: c.hex }}
            onClick={() => onChange(c.name)}
          />
        ))}
      </div>
      <p>Colour: {value.toUpperCase()}</p>
    </div>
  )
}
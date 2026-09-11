import styles from './ColourPicker.module.css'
import { COLOURS } from './colours'

export default function ColourPicker({ value, onChange }) {
  return (
    <div className={styles.picker}>
      <h3>[COLOUR]</h3>
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
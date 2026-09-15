import styles from './ColourPicker.module.css'
import { LENSCOLOURS } from './colours'

export default function LensPicker({ value, onChange }) {
  return (
    <div className={styles.picker}>
      <h3>[LENS TYPE]</h3>
      <div className={styles.swatches}>
        {LENSCOLOURS.map((c) => (
          <button
            key={c.name}
            className={`${styles.swatch} ${value === c.name ? styles.selected : ''}`}
            style={{
              backgroundColor: c.hex,
              ...(c.image ? { backgroundImage: `url(${c.image})` } : {}),
            }}
            onClick={() => onChange(c.name)}
            aria-label={`Choose ${c.name} lens colour`}
            title={`Choose ${c.name} lens colour`}
          />
        ))}
      </div>
      <p>Lens colour: {value.toUpperCase()}</p>
    </div>
  )
}
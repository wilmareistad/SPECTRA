import styles from './SizePicker.module.css'

const SIZES = ['Small', 'Standard', 'Large']

const SIZE_DESCRIPTIONS = {
  Small: 'Small fits smaller faces',
  Standard: 'Standard fits most faces',
  Large: 'Large fits wider faces',
}

export default function SizePicker({ value, onChange }) {

  return (
    <div className={styles.picker}>
      <h3>[SIZE]</h3>
      <div className={styles.sizeOptions}>
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className={`${styles.button} ${value === size ? styles.selected : ''}`}
            onClick={() => onChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <p>{SIZE_DESCRIPTIONS[value]}</p>
    </div>
  )
}
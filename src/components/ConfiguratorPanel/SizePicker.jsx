import { useState } from 'react'
import styles from './SizePicker.module.css'

const SIZES = ['Small', 'Standard', 'Large']

const SIZE_DESCRIPTIONS = {
  Small: 'Small fits smaller faces',
  Standard: 'Standard fits most faces',
  Large: 'Large fits wider faces',
}

export default function SizePicker() {
  const [selectedSize, setSelectedSize] = useState('Standard')

  return (
    <div className={styles.picker}>
      <h3>[SIZE]</h3>
      <div className={styles.sizeOptions}>
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className={`${styles.button} ${selectedSize === size ? styles.selected : ''}`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <p>{SIZE_DESCRIPTIONS[selectedSize]}</p>
    </div>
  )
}
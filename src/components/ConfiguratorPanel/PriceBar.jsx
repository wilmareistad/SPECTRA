import styles from './PriceBar.module.css'
import { calculatePrice } from './pricing'

export default function PriceBar({ selectedAttachments }) {
  const totalPrice = calculatePrice(selectedAttachments)

  return (
    <div className={styles.priceBar}>
      <span className={styles.price} aria-live="polite">{totalPrice}€</span>
      <button className="mainBtn">ADD TO CART</button>
    </div>
  )
}
import styles from './PriceBar.module.css'

export default function PriceBar() {
  return (
    <div className={styles.priceBar}>
      <span className={styles.price}>00000€</span>
      <button className="mainBtn">add to cart</button>
    </div>
  )
}
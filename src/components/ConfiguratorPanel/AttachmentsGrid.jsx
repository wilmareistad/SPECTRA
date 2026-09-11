import styles from './AttachmentsGrid.module.css'

const ITEMS = [
  { name: 'Laser', image: '/laser_alpha.png', price: '399€' },
  { name: 'Top', image: '/top_attach_alpha.png', price: '399€' },
  { name: 'Zoom', image: '/zoom_attach_alpha.png', price: '399€' },
]

export default function AttachmentsGrid() {
  return (
    <div className={styles.picker}>
      <h3>Attachments</h3>
      <div className={styles.attachmentsGrid}>
        {ITEMS.map((item) => (
          <div key={item.image} className={styles.attachmentItem}>
            <div className={styles.attachmentImage}>
              <img src={item.image} alt={item.name} />
            </div>
            <p>{item.name} <span>{item.price}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}
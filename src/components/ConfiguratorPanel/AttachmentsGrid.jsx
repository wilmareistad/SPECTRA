import styles from './AttachmentsGrid.module.css'
import { ATTACHMENTS } from './pricing'

export default function AttachmentsGrid({
  selectedAttachments,
  onAttachmentSelect,
}) {
  return (
    <div className={styles.picker}>
      <h3>[ATTACHEMENTS]</h3>
      <div className={styles.attachmentsGrid}>
        {ATTACHMENTS.map((item) => {
          const attachment = item.name.toLowerCase()
          const isSelected = selectedAttachments.includes(attachment)

          return (
            <div
              key={item.image}
              className={`${styles.attachmentItem} ${isSelected ? styles.selected : ''}`}
            >
              <button
                className={`${styles.attachmentImage} ${isSelected ? styles.selected : ''}`}
                type="button"
                onClick={() => onAttachmentSelect(
                  isSelected
                    ? selectedAttachments.filter((value) => value !== attachment)
                    : [...selectedAttachments, attachment],
                )}
                aria-label={`Select ${item.name} attachment`}
                aria-pressed={isSelected}
              >
                <img src={item.image} alt={item.name} />
              </button>
              <p>{item.name} <span>{item.price}€</span></p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
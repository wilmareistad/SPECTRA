import ColourPicker from './ColourPicker'
import LensTypePicker from './LensTypePicker'
import SizePicker from './SizePicker'
import AttachmentsGrid from './AttachmentsGrid'
import PriceBar from './PriceBar'
import styles from './ConfiguratorPanel.module.css'

export default function ConfiguratorPanel({
  colour,
  onColourChange,
  lensColour,
  onLensColourChange,
  selectedAttachments,
  onAttachmentSelect,
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <ColourPicker value={colour} onChange={onColourChange} />
      </div>
      <div className={styles.section}>
        <LensTypePicker value={lensColour} onChange={onLensColourChange} />
      </div>
      <div className={styles.section}>
        <SizePicker />
      </div>
      <div className={styles.section}>
        <AttachmentsGrid
          selectedAttachments={selectedAttachments}
          onAttachmentSelect={onAttachmentSelect}
        />
      </div>
      <div className={styles.priceSection}>
        <PriceBar selectedAttachments={selectedAttachments} />
      </div>
    </div>
  )
}
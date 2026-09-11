import ColourPicker from './ColourPicker'
import LensTypePicker from './LensTypePicker'
import SizePicker from './SizePicker'
import AttachmentsGrid from './AttachmentsGrid'
import PriceBar from './PriceBar'
import styles from './ConfiguratorPanel.module.css'

export default function ConfiguratorPanel({
  colour,
  onColourChange,
  attach1Visible,
  onAttach1VisibilityChange,
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <ColourPicker value={colour} onChange={onColourChange} />
      </div>
      <div className={styles.section}>
        <LensTypePicker />
      </div>
      <div className={styles.section}>
        <SizePicker />
      </div>
      <div className={styles.section}>
        <AttachmentsGrid
          attach1Visible={attach1Visible}
          onAttach1VisibilityChange={onAttach1VisibilityChange}
        />
      </div>
      <div className={styles.priceSection}>
        <PriceBar />
      </div>
    </div>
  )
}
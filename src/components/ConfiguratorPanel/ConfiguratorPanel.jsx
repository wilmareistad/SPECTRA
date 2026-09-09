import ColourPicker from './ColourPicker'
import LensTypePicker from './LensTypePicker'
import SizePicker from './SizePicker'
import AttachmentsGrid from './AttachmentsGrid'
import PriceBar from './PriceBar'

export default function ConfiguratorPanel({ colour, onColourChange }) {
  return (
    <div className="configurator-panel">
      <ColourPicker value={colour} onChange={onColourChange} />
      <LensTypePicker />
      <SizePicker />
      <AttachmentsGrid />
      <PriceBar />
    </div>
  )
}
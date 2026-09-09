export default function SizePicker() {
  return (
    <div className="picker">
      <h3>Size</h3>
      <div className="size-options">
        <span>Small</span>
        <span className="selected">Standard</span>
        <span>Large</span>
      </div>
      <p>Standard fits most face widths</p>
    </div>
  )
}
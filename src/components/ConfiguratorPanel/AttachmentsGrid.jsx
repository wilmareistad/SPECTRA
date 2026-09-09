const ITEMS = new Array(6).fill({ name: 'Camera', price: '399€' })

export default function AttachmentsGrid() {
  return (
    <div className="picker">
      <h3>Attachments</h3>
      <div className="attachments-grid">
        {ITEMS.map((item, i) => (
          <div key={i} className="attachment-item">
            <div className="attachment-image" />
            <p>{item.name} <span>{item.price}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}
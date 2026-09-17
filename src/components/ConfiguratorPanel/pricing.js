export const BASE_PRICE = 999

export const ATTACHMENTS = [
  { name: 'Laser', image: '/laser_alpha.png', price: 399 },
  { name: 'Lidar', image: '/top_attach_alpha.png', price: 349 },
  { name: 'Zoom', image: '/zoom_attach_alpha.png', price: 449 },
  { name: 'Solar', image: '/Attach_Solarpanel_Thumbnail.png', price: 499 },
  { name: 'Scope', image: '/Attach_Scope_Thumbnail.png', price: 399 },
]

export function calculatePrice(selectedAttachments) {
  return BASE_PRICE + selectedAttachments.reduce((total, attachmentName) => {
    const attachment = ATTACHMENTS.find(
      (item) => item.name.toLowerCase() === attachmentName,
    )

    return total + (attachment?.price ?? 0)
  }, 0)
}
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch (e) {
    return "-"
  }
}

/**
 * Calculate time since a given date
 */
export function getTimeSince(dateString: string | null | undefined): string {
  if (!dateString) return "-"

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  } catch (e) {
    return "-"
  }
}

/**
 * Extract numeric value from price string for sorting
 */
export function getPriceValue(price: string | null | undefined): number {
  if (!price) return 0
  return Number.parseFloat(price.replace(/[₦,]/g, "")) || 0
}

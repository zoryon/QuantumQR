/**
 * Represents an individual item within a QR code matrix.
 * 
 * Properties:
 * - id (number): Unique identifier for the matrix item.
 * - type (string): Type/category of the matrix item (e.g., "data", "logo").
 * - color (string): Color code or name used for the matrix item.
 * - icon (string): Icon identifier or path associated with the matrix item.
 */
export type QRMatrixItem = {
    id: number,
    type: string, 
    color: string, 
    icon: string
}

/**
 * Represents a single feature within the application or service.
 * 
 * Properties:
 * - title (string): Title or name of the feature.
 * - description (string): Brief explanation of what the feature does.
 * - symbol (string): Icon or symbol visually representing the feature.
 */
export type Feature = {
    title: string,
    description: string,
    symbol: string
}

/**
 * Represents statistical data for demonstration purposes.
 * 
 * Properties:
 * - metric (string): The name or label of the metric being measured.
 * - value (string): The current value of the metric.
 * - change (string): Percentage or absolute change in the metric (e.g., "+5%", "-10").
 */
export type DemoStat = {
    metric: string,
    value: string,
    change: string
}

/**
 * Represents a pricing plan offered to users.
 * 
 * Properties:
 * - tier (string): The tier name (e.g., "Basic", "Pro", "Enterprise").
 * - price (string): Price associated with the plan (formatted string, e.g., "$9.99/month").
 * - features (string[]): List of features included in the plan.
 * - gradient (string): Gradient style identifier used for visual presentation of the plan.
 */
export type PricingPlan = {
    tier: string,
    price: string,
    features: string[],
    gradient: string
}
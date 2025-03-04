export type QRMatrixItem = {
    id: number,
    type: string, 
    color: string, 
    icon: string
}

export type Feature = {
    title: string,
    description: string,
    symbol: string
}

export type DemoStat = {
    metric: string,
    value: string,
    change: string
}

export type PricingPlan = {
    tier: string,
    price: string,
    features: string[],
    gradient: string
}
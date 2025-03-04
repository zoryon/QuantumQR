import { 
    DemoStat, 
    Feature, 
    PricingPlan, 
    QRMatrixItem 
} from "@/types/landingType";

export const QR_MATRIX: QRMatrixItem[] = [
    { id: 1, type: 'hologram', color: 'from-purple-500 to-cyan-500', icon: 'fa-burst' },
    { id: 2, type: 'animated', color: 'from-pink-500 to-orange-500', icon: 'fa-motion' },
    { id: 3, type: 'ar', color: 'from-cyan-500 to-emerald-500', icon: 'fa-cube' },
    { id: 4, type: 'neon', color: 'from-violet-500 to-fuchsia-500', icon: 'fa-lightbulb' },
];

export const FRACTAL_FEATURES: Feature[] = [
    { title: "Easy Management", description: "Manage all your QR Codes in a single place.", symbol: "⟁⃒" },
    { title: "Fluid Morphology", description: "Edit your QR Codes whenever.", symbol: "⤲⤹" },
    { title: "Scan Tracking", description: "Real-time analytics.", symbol: "⌖⃘" },
    { title: "Networks", description: "Build connection sharing your virtual card.", symbol: "ꝏ⃟" },
];

export const DEMO_STATS: DemoStat[] = [
    { metric: "Active Scans", value: "24.8K", change: "+12.4%" },
    { metric: "Unique Devices", value: "18.3K", change: "+8.2%" },
    { metric: "Data Density", value: "94%", change: "±3.1%" },
] as const;

export const PRICING_PLANS: PricingPlan[] = [
    { tier: "Nova", price: "2.99", features: ["3D Patterns", "Basic Analytics", "API Access"], gradient: "from-cyan-500 to-emerald-500" },
    { tier: "Chrono", price: "5.99", features: ["4D Tracking", "Temporal Scans", "Holo Previews"], gradient: "from-pink-500 to-orange-500" },
    { tier: "Quantum", price: "11.99", features: ["11D Matrices", "AI Encryption", "Neural Analytics"], gradient: "from-purple-500 to-cyan-500" },
] as const;
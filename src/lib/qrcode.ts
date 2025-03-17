import QRCode from "qrcode";

export async function generateQRCode(obj: string): Promise<string> {
    // Generate the QR code as an SVG string from the website URL
    const svgString = await QRCode.toString(obj, {
        type: "svg",
        color: {
            dark: "#000000",
            light: "#ffffff"
        }
    });

    // Convert the SVG string to a base64 encoded data URL
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
}

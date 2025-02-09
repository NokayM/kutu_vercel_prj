import { NextResponse } from "next/server";
import crypto from "crypto";

const SHOPIFY_SHARED_SECRET = process.env.SHOPIFY_SHARED_SECRET;

// Shopify HMAC doğrulama fonksiyonu
function verifyShopifyRequest(query: URLSearchParams) {
    const hmac = query.get("hmac");
    if (!hmac) return false;

    const orderedParams = [...query.entries()]
        .filter(([key]) => key !== "hmac")
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    const generatedHmac = crypto
        .createHmac("sha256", SHOPIFY_SHARED_SECRET!)
        .update(orderedParams)
        .digest("hex");

    return generatedHmac === hmac;
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const queryParams = url.searchParams;

        // Shopify HMAC doğrulamasını yap
        if (!verifyShopifyRequest(queryParams)) {
            return NextResponse.json({ error: "Geçersiz Shopify isteği" }, { status: 403 });
        }

        return NextResponse.json({ message: "Shopify App Proxy bağlantısı başarılı!" });
    } catch (error) {
        console.error("API Hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

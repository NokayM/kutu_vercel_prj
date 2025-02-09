import { NextResponse } from "next/server";
import crypto from "crypto";

const SHOPIFY_SHARED_SECRET = process.env.SHOPIFY_SHARED_SECRET;

function verifyShopifyRequest(url: URL) {
    const queryParams = new URLSearchParams(url.search);
    const hmac = queryParams.get("hmac");

    if (!hmac) return false;

    queryParams.delete("hmac");

    const orderedParams = [...queryParams.entries()]
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

        // Shopify HMAC doğrulamasını yap
        if (!verifyShopifyRequest(url)) {
            return NextResponse.json({ error: "Geçersiz Shopify isteği (HMAC doğrulama başarısız)" }, { status: 403 });
        }

        return NextResponse.json({ message: "Shopify App Proxy bağlantısı başarılı!" });
    } catch (error) {
        console.error("API Hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

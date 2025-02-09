import { NextResponse } from "next/server";
import crypto from "crypto";

const SHOPIFY_API_SECRET_KEY = process.env.SHOPIFY_API_SECRET_KEY;

function verifyShopifyRequest(url: URL) {
    const queryParams = new URLSearchParams(url.search);
    const hmac = queryParams.get("hmac");

    if (!hmac) {
        console.log("❌ HMAC eksik! Shopify’dan gelen parametreler:", queryParams.toString());
        return false;
    }

    // HMAC doğrulaması için kullanılacak parametreleri düzenle
    queryParams.delete("hmac");

    const orderedParams = [...queryParams.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
        .join("&");

    const generatedHmac = crypto
        .createHmac("sha256", SHOPIFY_API_SECRET_KEY!)
        .update(orderedParams)
        .digest("hex");

    console.log("✅ Shopify’dan gelen HMAC:", hmac);
    console.log("✅ Bizim oluşturduğumuz HMAC:", generatedHmac);

    return generatedHmac === hmac;
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        if (!verifyShopifyRequest(url)) {
            return NextResponse.json({ error: "Geçersiz Shopify isteği (HMAC doğrulama başarısız)" }, { status: 403 });
        }

        return NextResponse.json({ message: "Shopify App Proxy bağlantısı başarılı!" });
    } catch (error) {
        console.error("API Hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Ürün tipi tanımlaması
interface Urun {
    Url: string;
    Title: string;
    Price: string;
    İmage: string;
    olculer: number[] | null;
}

// Ölçüleri çıkaran fonksiyon
function extractDimensions(text: string): number[] | null {
    const pattern = /(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)/;
    const match = text.match(pattern);
    return match ? [parseFloat(match[1]), parseFloat(match[3]), parseFloat(match[5])] : null;
}

// Ölçüleri karşılaştıran fonksiyon (Öklid Mesafesi ile karşılaştırma)
function olculeriKarsilastir(istenenOlcu: number[], stokOlcu: number[]): number {
    return Math.sqrt(
        (istenenOlcu[0] - stokOlcu[0]) ** 2 +
        (istenenOlcu[1] - stokOlcu[1]) ** 2 +
        (istenenOlcu[2] - stokOlcu[2]) ** 2
    );
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const olcuInput = url.searchParams.get("olcu");

        if (!olcuInput) {
            return NextResponse.json({ error: "Geçersiz ölçü formatı" }, { status: 400 });
        }

        const istenenOlcu = extractDimensions(olcuInput);
        if (!istenenOlcu) {
            return NextResponse.json({ error: "Ölçüleri uygun formatta girin! Örn: 12x12x13 cm" }, { status: 400 });
        }

        // Veriyi public klasöründen oku
        const filePath = join(process.cwd(), "public/data/olculer.json");
        const fileContents = readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContents);

        // Ölçüleri parse et ve mesafeye göre sırala
        const urunler: Urun[] = data.data
            .map((urun: any) => ({
                ...urun,
                olculer: extractDimensions(urun.Title),
            }))
            .filter((urun: Urun) => urun.olculer !== null) // Geçersiz ölçüleri filtrele
            .map((urun: Urun) => ({
                ...urun,
                similarity: olculeriKarsilastir(istenenOlcu, urun.olculer as number[]),
            }))
            .sort((a: Urun, b: Urun) => a.similarity - b.similarity) // En yakınları sırala
            .slice(0, 3); // İlk 3 ürünü al

        return NextResponse.json({ urunler });
    } catch (error) {
        console.error("API Hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

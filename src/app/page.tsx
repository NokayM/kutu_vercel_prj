"use client";
import { useState } from "react";
import Slider from "./components/Slider";

export default function Home() {
    const [olcu, setOlcu] = useState("");
    const [oneriler, setOneriler] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sonucMesaji, setSonucMesaji] = useState("Lütfen ölçüleri girin ve 'Öneri Al' butonuna tıklayın.");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSonucMesaji("Yükleniyor...");

        try {
            const response = await fetch(`/api/urunler?olcu=${olcu}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (data.urunler && data.urunler.length > 0) {
                setOneriler(data.urunler);
            } else {
                setOneriler([]);
                setSonucMesaji("Öneri bulunamadı.");
            }
        } catch (error) {
            console.error("Hata:", error);
            setSonucMesaji("Bir hata oluştu. Lütfen tekrar deneyin.");
        }

        setLoading(false);
    };

    return (
        <div className="container">
            <h1>Kutufix Kutu Öneri Sistemi</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        value={olcu}
                        onChange={(e) => setOlcu(e.target.value)}
                        placeholder="Talep ettiğiniz ürün ölçülerini ekleyiniz. Örn: (12x12x13 cm)"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Yükleniyor..." : "Öneri Al"}
                    </button>
                </div>
            </form>

            {/* Eğer öneriler varsa Slider'ı göster */}
            {oneriler.length > 0 ? (
                <>
                    <h3>En Yakın Ölçülerdeki Ürünler:</h3>
                    <Slider oneriler={oneriler} />
                </>
            ) : (
                <p>{sonucMesaji}</p>
            )}
        </div>
    );
}

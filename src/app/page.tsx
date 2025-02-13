"use client";
import { useState } from "react";

// Ürün tipi tanımlaması
interface Urun {
  Url: string;
  Title: string;
  Price: string;
  İmage: string;
}

export default function Home() {
    const [olcu, setOlcu] = useState<string>(""); // string tipi belirtiliyor
    const [oneriler, setOneriler] = useState<Urun[]>([]); // Urun tipi ile dizi tanımlandı
    const [loading, setLoading] = useState<boolean>(false);
    const [sonucMesaji, setSonucMesaji] = useState<string>("Lütfen ölçüleri girin ve 'Öneri Al' butonuna tıklayın.");

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

            {/* Eğer öneriler varsa önerileri listele */}
            {oneriler.length > 0 ? (
                <>
                    <h3>En Yakın Ölçülerdeki Ürünler:</h3>
                    <ul>
                        {oneriler.map((urun, index) => (
                            <li key={index}>
                                <img src={urun.İmage} alt={urun.Title} />
                                <h4>{urun.Title}</h4>
                                <p>{urun.Price}</p>
                                <a href={urun.Url} target="_blank" rel="noopener noreferrer">Ürün Sayfasına Git</a>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>{sonucMesaji}</p>
            )}
        </div>
    );
}
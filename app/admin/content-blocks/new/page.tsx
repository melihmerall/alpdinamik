"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContentBlock() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    body: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/content-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: formData.key,
          title: formData.title || null,
          body: formData.body || null,
        }),
      });

      if (response.ok) {
        router.push("/admin/content-blocks");
      } else {
        const error = await response.json();
        alert(error.error || "İçerik bloğu eklenirken hata oluştu");
      }
    } catch (error) {
      console.error("Error creating content block:", error);
      alert("İçerik bloğu eklenirken hata oluştu");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          Yeni İçerik Bloğu
        </h1>
        <p style={{ color: "#6b7280" }}>
          Yeni bir içerik bloğu ekleyin
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Anahtar (Key) *
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                required
                placeholder="ornek_anahtar_adi"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "monospace",
                }}
              />
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
                Benzersiz bir anahtar giriniz (örn: home_hero_title)
              </p>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Başlık
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                İçerik
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={10}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/content-blocks")}
            style={{
              background: "#f3f4f6",
              color: "#374151",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}


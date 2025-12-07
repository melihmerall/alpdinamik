"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditContentBlock({ params }: { params: { key: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    body: "",
  });

  useEffect(() => {
    fetchContentBlock();
  }, [params.key]);

  const fetchContentBlock = async () => {
    try {
      const response = await fetch(`/api/content-blocks/${params.key}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          key: data.key || "",
          title: data.title || "",
          body: data.body || "",
        });
      }
    } catch (error) {
      console.error("Error fetching content block:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/content-blocks/${params.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title || null,
          body: formData.body || null,
        }),
      });

      if (response.ok) {
        router.push("/admin/content-blocks");
      } else {
        const error = await response.json();
        alert(error.error || "İçerik bloğu güncellenirken hata oluştu");
      }
    } catch (error) {
      console.error("Error updating content block:", error);
      alert("İçerik bloğu güncellenirken hata oluştu");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          İçerik Bloğunu Düzenle
        </h1>
        <p style={{ color: "#6b7280" }}>
          İçerik bloğu bilgilerini güncelleyin
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
                Anahtar (Key)
              </label>
              <input
                type="text"
                value={formData.key}
                disabled
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  background: "#f9fafb",
                  cursor: "not-allowed",
                }}
              />
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
                Anahtar değiştirilemez
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
            Güncelle
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

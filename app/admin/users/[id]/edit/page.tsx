"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "EDITOR",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          email: data.email || "",
          name: data.name || "",
          role: data.role || "EDITOR",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır");
      return;
    }

    try {
      const updateData: any = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };

      // Only include password if it's provided
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/admin/users");
      } else {
        const error = await response.json();
        alert(error.error || "Kullanıcı güncellenirken hata oluştu");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Kullanıcı güncellenirken hata oluştu");
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
          Kullanıcıyı Düzenle
        </h1>
        <p style={{ color: "#6b7280" }}>
          Kullanıcı bilgilerini güncelleyin
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
                E-posta *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
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
                İsim *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
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
                Rol *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div style={{ 
              borderTop: "1px solid #e5e7eb", 
              paddingTop: "1.5rem",
              marginTop: "1rem"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
                Şifre Değiştir (Opsiyonel)
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>
                Şifreyi değiştirmek istemiyorsanız boş bırakın
              </p>

              <div style={{ display: "grid", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={6}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                  />
                  <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
                    En az 6 karakter
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Yeni Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    minLength={6}
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
            onClick={() => router.push("/admin/users")}
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


"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_NAME = "alp_cookie_consent";
const COOKIE_DURATION_DAYS = 180;

const getCookieValue = (name) => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const cookie of cookies) {
        const [cookieName, ...rest] = cookie.split("=");
        if (cookieName === name) {
            return rest.join("=");
        }
    }
    return null;
};

const setCookieValue = (name, value, days) => {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    const cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    document.cookie = cookie;
};

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const consentValue = getCookieValue(COOKIE_NAME);
        if (!consentValue) {
            setIsVisible(true);
        }
    }, []);

    const handleChoice = (value) => {
        setCookieValue(COOKIE_NAME, value, COOKIE_DURATION_DAYS);
        setIsClosing(true);
        setTimeout(() => setIsVisible(false), 250);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Çerez izni bildirimi"
            style={{
                position: "fixed",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(520px, calc(100% - 32px))",
                zIndex: 9999,
                pointerEvents: "none"
            }}
        >
            <div
                style={{
                    background: "var(--bg-white)",
                    borderRadius: "18px",
                    padding: "24px 28px",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                    border: "1px solid var(--border-color-1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    transform: isClosing ? "translateY(8px)" : "translateY(0)",
                    opacity: isClosing ? 0 : 1,
                    transition: "all 0.25s ease",
                    pointerEvents: "auto",
                    backgroundImage:
                        "linear-gradient(135deg, rgba(0,123,255,0.08), rgba(0,0,0,0))"
                }}
            >
                <div>
                    <strong style={{ color: "var(--text-heading-color)" }}>
                        Deneyiminizi geliştirmek için çerez kullanıyoruz
                    </strong>
                    <p style={{ margin: "8px 0 0", color: "var(--body-color)", lineHeight: 1.6 }}>
                        Zorunlu çerezler sitemizin doğru çalışması için aktif. Detayları{" "}
                        <Link href="/cerez-politikasi" style={{ color: "var(--primary-color-1)" }}>
                            çerez politikamızda
                        </Link>{" "}
                        inceleyebilir, tercihinizi aşağıdan belirleyebilirsiniz.
                    </p>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        justifyContent: "flex-end"
                    }}
                >
                    <button
                        type="button"
                        onClick={() => handleChoice("declined")}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "999px",
                            border: "1px solid var(--border-color-1)",
                            background: "transparent",
                            color: "var(--body-color)",
                            fontWeight: 600,
                            transition: "all 0.2s ease",
                            cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--color-2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        Sadece zorunlu olanlara izin ver
                    </button>
                    <button
                        type="button"
                        className="build_button"
                        onClick={() => handleChoice("accepted")}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "999px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600
                        }}
                    >
                        Tüm çerezleri kabul et
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;

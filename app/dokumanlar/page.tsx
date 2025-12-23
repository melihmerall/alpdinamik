import SEO from "@/components/data/seo";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import SwitchTab from "@/components/pages/common/dark-light";
import CustomCursor from "@/components/pages/common/cursor";
import Image from "next/image";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  imageUrl?: string | null;
  pdfUrl: string;
};

async function getDocuments(): Promise<Document[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/documents`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <>
      <SEO pageTitle="Dökümanlar" />
      <CustomCursor />
      <SwitchTab />
      <HeaderTwo />
      <BreadCrumb
        title="Dökümanlar"
        innerTitle="Teknik Dökümanlar ve Kataloglar"
      />

      <section className="documents-list section-padding">
        <div className="container">
          {documents.length === 0 ? (
            <div className="documents-empty">
              <p>
                Henuz dokuman eklenmemis. Admin panelinden kolayca yeni Dökümanlar
                ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="row">
              {documents.map((doc) => (
                <div key={doc.id} className="col-lg-6 col-md-6 col-sm-12">
                  <div className="document-item">
                    <Link
                      href={doc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-item__link"
                    >
                      <div className="document-item__image-wrapper">
                        {doc.imageUrl ? (
                          <Image
                            src={doc.imageUrl}
                            alt={doc.title}
                            width={400}
                            height={565}
                            className="document-item__image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="document-item__placeholder">
                            <span className="document-item__placeholder-icon">PDF</span>
                          </div>
                        )}
                      </div>
                      <div className="document-item__content">
                        <h4 className="document-item__title">{doc.title}</h4>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterTwo />
    </>
  );
}

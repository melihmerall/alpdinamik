"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SEO from "@/components/data/seo";
import HeaderFour from "@/components/layout/headers/header-four";
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

type Representative = {
  breadcrumbImageUrl?: string | null;
};

export default function RepresentativeDocumentsPage() {
  const params = useParams();
  const repSlug = params.slug as string;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [representative, setRepresentative] = useState<Representative | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        
        const [documentsRes, repRes] = await Promise.all([
          fetch(`${baseUrl}/api/documents`),
          fetch(`${baseUrl}/api/representatives/${repSlug}`),
        ]);

        if (documentsRes.ok) {
          const documentsData = await documentsRes.json();
          setDocuments(Array.isArray(documentsData) ? documentsData : []);
        }

        if (repRes.ok) {
          const repData = await repRes.json();
          setRepresentative(repData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [repSlug]);

  // Breadcrumb görseli: Representative'ın breadcrumbImageUrl'i
  const breadcrumbBgImage = 
    representative?.breadcrumbImageUrl ||
    '/assets/img/breadcrumb.jpg';

  if (loading) {
    return (
      <>
        <HeaderFour />
        <div className="page-wrapper">
          <div className="section-padding">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 text-center py-5">
                  <p>Yükleniyor...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterTwo />
      </>
    );
  }

  return (
    <>
      <SEO pageTitle="Dökümanlar" />
      <CustomCursor />
      <SwitchTab />
      <HeaderFour />
      <BreadCrumb
        title="Dökümanlar"
        innerTitle="Teknik Dökümanlar ve Kataloglar"
        backgroundImage={breadcrumbBgImage}
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

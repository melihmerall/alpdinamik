"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SEO from "@/components/data/seo";
import HeaderFour from "@/components/layout/headers/header-four";
import FooterTwo from "@/components/layout/footers/footer-two";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import SwitchTab from "@/components/pages/common/dark-light";
import CustomCursor from "@/components/pages/common/cursor";

type ApplicationBlock = {
  id: string;
  title: string;
  summary?: string | null;
  body?: string | null;
  imageUrl?: string | null;
};

type Representative = {
  breadcrumbImageUrl?: string | null;
};

export default function RepresentativeApplicationsPage() {
  const params = useParams();
  const repSlug = params.slug as string;

  const [applications, setApplications] = useState<ApplicationBlock[]>([]);
  const [representative, setRepresentative] = useState<Representative | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        
        const [applicationsRes, repRes] = await Promise.all([
          fetch(`${baseUrl}/api/applications`),
          fetch(`${baseUrl}/api/representatives/${repSlug}`),
        ]);

        if (applicationsRes.ok) {
          const applicationsData = await applicationsRes.json();
          setApplications(Array.isArray(applicationsData) ? applicationsData : []);
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
      <SEO pageTitle="Uygulamalar" />
      <CustomCursor />
      <SwitchTab />
      <HeaderFour />
      <BreadCrumb
        title="Uygulamalar"
        innerTitle="Uygulama Çözümleri"
        backgroundImage={breadcrumbBgImage}
      />

      <section className="applications-list section-padding">
        <div className="container">
          {applications.length === 0 ? (
            <div className="applications-empty">
              <p>
                Henüz uygulama içeriği eklenmemiş. Admin panelinden kolayca yeni bloklar
                ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="applications-list__items">
              {applications.map((app, index) => {
                return (
                  <article key={app.id} className="application-item">
                    {app.imageUrl && (
                      <div className="application-item__media">
                        <img src={app.imageUrl} alt={app.title} loading="lazy" />
                      </div>
                    )}
                    <div className="application-item__content">
                      <div className="application-item__header">
                        <h2 className="application-item__title">{app.title}</h2>
                        <span className="application-item__number">
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </span>
                      </div>
                      {app.summary && (
                        <p className="application-item__summary">{app.summary}</p>
                      )}
                      {app.body && (
                        <div
                          className="application-item__body"
                          dangerouslySetInnerHTML={{
                            __html: app.body.replace(/\n/g, "<br />"),
                          }}
                        />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <FooterTwo />
    </>
  );
}

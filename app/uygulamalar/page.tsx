import SEO from "@/components/data/seo";
import HeaderTwo from "@/components/layout/headers/header-two";
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

async function getApplications(): Promise<ApplicationBlock[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/applications`, {
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

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <>
      <SEO pageTitle="Uygulamalar" />
      <CustomCursor />
      <SwitchTab />
      <HeaderTwo />
      <BreadCrumb
        title="Uygulamalar"
        innerTitle="Uygulama Çözümleri"
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

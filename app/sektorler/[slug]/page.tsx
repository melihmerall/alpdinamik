import { notFound } from "next/navigation";
import { headers } from "next/headers";
import SectorDetails from "@/components/pages/sectors/sector-details";

function getBaseUrl(): string {
  // Environment variable varsa onu kullan
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Server-side'da headers'dan hostname al
  try {
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    if (host) {
      return `${protocol}://${host}`;
    }
  } catch {
    // headers() çağrılamazsa (örneğin build zamanında)
  }
  
  // Fallback
  return 'http://localhost:3000';
}

async function getSector(slug: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/sectors/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function SectorPage({ params }: { params: { slug: string } }) {
  const sector = await getSector(params.slug);

  if (!sector) {
    notFound();
  }

  const singleData = {
    id: sector.id,
    name: sector.name,
    slug: sector.slug,
    description: sector.description,
    imageUrl: sector.imageUrl,
    breadcrumbImageUrl: sector.breadcrumbImageUrl,
  };

  return <SectorDetails singleData={singleData} />;
}


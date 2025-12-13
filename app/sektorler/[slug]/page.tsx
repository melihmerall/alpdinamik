import { notFound } from "next/navigation";
import SectorDetails from "@/components/pages/sectors/sector-details";

async function getSector(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/sectors/${slug}`, {
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


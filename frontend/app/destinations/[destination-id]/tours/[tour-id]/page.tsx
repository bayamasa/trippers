import { notFound } from "next/navigation";
import { getTourDetail, APIError } from "@/lib/api-client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TourHeroSection } from "@/components/tour-hero-section";
import { TourInfoSection } from "@/components/tour-info-section";
import { TourStocksSection } from "@/components/tour-stocks-section";

interface TourDetailPageProps {
  params: Promise<{
    "destination-id": string;
    "tour-id": string;
  }>;
}

async function getTourData(destinationId: string, tourId: string) {
  try {
    const destinationIdNum = parseInt(destinationId, 10);
    const tourIdNum = parseInt(tourId, 10);

    if (isNaN(destinationIdNum) || isNaN(tourIdNum)) {
      return null;
    }

    const tourData = await getTourDetail(destinationIdNum, tourIdNum);
    return tourData;
  } catch (error) {
    if (error instanceof APIError && error.status === 404) {
      return null;
    }
    console.error("Error fetching tour data:", error);
    return null;
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { "destination-id": destinationId, "tour-id": tourId } = await params;
  const tourData = await getTourData(destinationId, tourId);

  if (!tourData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TourHeroSection
          title={tourData.tour.title}
          thumbnailFileName={tourData.tour.thumbnailFileName}
        />
        <TourInfoSection
          tour={tourData.tour}
          destination={tourData.destination}
          area={tourData.area}
        />
        <TourStocksSection
          stocks={tourData.stocks}
          tourId={tourData.tour.id}
        />
      </main>
      <Footer />
    </div>
  );
}


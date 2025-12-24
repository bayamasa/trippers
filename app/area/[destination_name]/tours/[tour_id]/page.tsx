import { notFound } from "next/navigation";
import { db } from "@/db";
import {
  areasTable,
  destinationsTable,
  reservationEventsTable,
  tourStocksTable,
  toursTable,
} from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TourHeroSection } from "@/components/tour-hero-section";
import { TourInfoSection } from "@/components/tour-info-section";
import { TourStocksSection } from "@/components/tour-stocks-section";

interface TourDetailPageProps {
  params: Promise<{
    destination_name: string;
    tour_id: string;
  }>;
}

async function getTourData(destinationName: string, tourId: string) {
  try {
    // URLデコード
    const decodedDestinationName = decodeURIComponent(destinationName);
    const tourIdNum = parseInt(tourId, 10);

    if (isNaN(tourIdNum)) {
      return null;
    }

    // ツアー情報を取得（JOINでarea、destination、tour_stocksも取得）
    const tour = await db
      .select({
        tour: toursTable,
        destination: destinationsTable,
        area: areasTable,
      })
      .from(toursTable)
      .innerJoin(
        destinationsTable,
        eq(toursTable.destinationId, destinationsTable.id)
      )
      .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))
      .where(
        and(
          eq(toursTable.id, tourIdNum),
          eq(destinationsTable.name, decodedDestinationName)
        )
      )
      .limit(1);

    if (tour.length === 0) {
      return null;
    }

    // 利用可能な在庫情報を取得（未来の日付のみ）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stocks = await db
      .select()
      .from(tourStocksTable)
      .where(
        and(
          eq(tourStocksTable.tourId, tourIdNum),
          gte(tourStocksTable.eventStartDate, today.toISOString().split("T")[0])
        )
      )
      .orderBy(tourStocksTable.eventStartDate);

    // 各在庫の予約数を取得
    const stocksWithReservations = await Promise.all(
      stocks.map(async (stock) => {
        const reservations = await db
          .select({
            numberOfPeople: reservationEventsTable.numberOfPeople,
          })
          .from(reservationEventsTable)
          .where(
            and(
              eq(reservationEventsTable.tourStockId, stock.id),
              eq(reservationEventsTable.status, "confirmed")
            )
          );

        const reservedCount = reservations.reduce(
          (sum, r) => sum + r.numberOfPeople,
          0
        );

        return {
          ...stock,
          availableCapacity: stock.maxCapacity - reservedCount,
        };
      })
    );

    return {
      tour: tour[0].tour,
      destination: tour[0].destination,
      area: tour[0].area,
      stocks: stocksWithReservations.filter(
        (stock) => stock.availableCapacity > 0
      ),
    };
  } catch (error) {
    console.error("Error fetching tour data:", error);
    return null;
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { destination_name, tour_id } = await params;
  const tourData = await getTourData(destination_name, tour_id);

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


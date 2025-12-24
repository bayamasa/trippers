import { Calendar } from "lucide-react";
import { ReservationButton } from "@/components/reservation-button";

interface Stock {
  id: number;
  eventStartDate: Date | string;
  maxCapacity: number;
  availableCapacity: number;
}

interface TourStocksSectionProps {
  stocks: Stock[];
  tourId: number;
}

export function TourStocksSection({
  stocks,
  tourId,
}: TourStocksSectionProps) {
  if (stocks.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              現在、利用可能な日程がありません
            </p>
          </div>
        </div>
      </section>
    );
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="mb-8 text-balance font-bold text-2xl md:text-3xl">
          利用可能な日程
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => (
            <div
              key={stock.id}
              className="flex flex-col justify-between rounded-lg border p-6"
            >
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    {formatDate(stock.eventStartDate)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  残り {stock.availableCapacity} 席 / 定員 {stock.maxCapacity}
                   {" "}席
                </p>
              </div>
              <ReservationButton
                tourId={tourId}
                stockId={stock.id}
                availableCapacity={stock.availableCapacity}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


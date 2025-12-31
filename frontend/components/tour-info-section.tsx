import { MapPin, Plane, Calendar, Hotel } from "lucide-react";

interface TourInfoSectionProps {
  tour: {
    id: number;
    title: string;
    minPriceTaxIncluded: number;
    days: number;
    isDirectFlight: boolean;
    thumbnailFileName: string;
  };
  destination: {
    id: number;
    name: string;
  };
  area: {
    id: number;
    name: string;
  };
}

export function TourInfoSection({
  tour,
  destination,
  area,
}: TourInfoSectionProps) {
  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}~`;
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">
              {area.name} / {destination.name}
            </span>
          </div>
          <div className="mb-6">
            <h2 className="mb-4 text-balance font-bold text-3xl md:text-4xl">
              {tour.title}
            </h2>
            <p className="text-balance text-2xl font-bold text-primary">
              {formatPrice(tour.minPriceTaxIncluded)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Calendar className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">旅行日数</p>
              <p className="font-semibold">{tour.days}泊{tour.days + 1}日</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Plane className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">フライト</p>
              <p className="font-semibold">
                {tour.isDirectFlight ? "直行便" : "経由便"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Hotel className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">ホテル</p>
              <p className="font-semibold">含まれる</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


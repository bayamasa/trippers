"use client";

import { Button } from "@/components/ui/button";

interface ReservationButtonProps {
  tourId: number;
  stockId: number;
  availableCapacity: number;
}

export function ReservationButton({
  tourId,
  stockId,
  availableCapacity,
}: ReservationButtonProps) {
  const handleReservation = () => {
    // TODO: 予約処理を実装
    console.log("Reservation clicked", { tourId, stockId });
    alert("予約機能は今後実装予定です");
  };

  return (
    <Button
      className="w-full"
      onClick={handleReservation}
      disabled={availableCapacity <= 0}
    >
      {availableCapacity > 0 ? "予約する" : "満席"}
    </Button>
  );
}


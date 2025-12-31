import Image from "next/image";

interface TourHeroSectionProps {
  title: string;
  thumbnailFileName: string;
}

export function TourHeroSection({
  title,
  thumbnailFileName,
}: TourHeroSectionProps) {
  return (
    <section className="relative h-96 w-full overflow-hidden">
      <Image
        src={`/${thumbnailFileName}`}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="container relative z-10 flex h-full items-center">
        <h1 className="text-balance font-bold text-4xl text-white md:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  );
}


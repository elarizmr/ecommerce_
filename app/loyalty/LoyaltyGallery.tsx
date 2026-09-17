import Image from "next/image";

interface LoyaltyGalleryProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function LoyaltyGallery({
  imageSrc = "/images/loyalty.jpg",
  imageAlt = "Friends laughing together at dinner",
}: LoyaltyGalleryProps) {
  return (
    <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden md:h-[60vh]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
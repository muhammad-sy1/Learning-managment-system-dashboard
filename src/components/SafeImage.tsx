"use client";
import placeholder from "@/../public/images/imgPlaceholder.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type TImagePopupProps = {
  imageUrl?: string | null;
  alt: string | undefined;
  className?: string;
  IsStyle2?: boolean;
  thumbnailProps?: Omit<ImageProps, "src" | "alt">;
  disablePopup?: boolean;
};

export function SafeImage({
  imageUrl,
  alt,
  IsStyle2,
  className,
  disablePopup = true,
}: TImagePopupProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleThumbnailClick = () => {
    if (imageUrl && disablePopup) setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setIsImageLoaded(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClosePopup();
    };

    if (isPopupOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isPopupOpen]);

  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${imageUrl}`
    : placeholder.src;

  return (
    <>
      {/* Thumbnail with click */}
      <Card
        className={`${
          className ? className : "w-16 h-16 rounded "
        }   p-0 overflow-hidden cursor-pointer border-0 
  shadow-md hover:shadow-lg transition-all `}
      >
        <CardContent className="p-0 relative h-full">
          <div
            onClick={handleThumbnailClick}
            // className="h-16 w-full relative aspect-square"
          >
            {!isImageLoaded && (
              <div className="absolute inset-0 rounded-[20px] p-[2px] bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-full h-full rounded-[18px] bg-gray-900"></div>
              </div>
            )}
            <Image
              src={fullImageUrl}
              alt={alt ?? "image"}
              fill
              className="object-cover "
              placeholder="blur"
              blurDataURL={placeholder.src}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[99999999999]  flex items-center justify-center bg-background/80   backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleClosePopup}></div>

          <div className="relative z-50 max-w-4xl w-full mx-4 max-h-[85vh] flex items-center justify-center">
            <Button
              onClick={handleClosePopup}
              size="icon"
              variant="outline"
              className="absolute top-2 right-2 z-50 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </Button>

            <Card className={`w-full  overflow-hidden shadow-lg pb-0`}>
              <CardContent
                className={`p-0 relative flex ${
                  IsStyle2 == true ? "h-10" : "h-full"
                } items-center justify-center`}
              >
                {/* Loading indicator */}
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="h-10 w-10 animate-spin text-primary " />
                  </div>
                )}

                {/* Full Image */}
                <Image
                  src={fullImageUrl}
                  alt={alt ?? "image"}
                  width={1920}
                  height={1080}
                  className={`h-[60vh] w-auto object-contain transition-opacity duration-500 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </CardContent>

              {/* Image caption */}
              {alt && (
                <div className="p-4 bg-muted border-t">
                  <p className="text-sm text-center font-medium">{alt}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

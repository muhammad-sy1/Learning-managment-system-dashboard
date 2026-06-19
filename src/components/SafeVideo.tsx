"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play, X } from "lucide-react";
import { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type TVideoPopupProps = {
  videoUrl?: string | null;
  alt: string;
  thumbnailProps?: Omit<ImageProps, "src" | "alt">;
};

export function SafeVideo({ videoUrl, alt }: TVideoPopupProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupVideoRef = useRef<HTMLVideoElement>(null);

  const handleThumbnailClick = () => {
    if (videoUrl) setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setIsVideoLoaded(false);
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
      popupVideoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoad = () => setIsVideoLoaded(true);

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

  const fullVideoUrl = videoUrl
    ? videoUrl.startsWith("http")
      ? videoUrl
      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${videoUrl}`
    : undefined;

  //  if(isVideoLoaded){
  //     return (
  //       <div className="absolute inset-0 rounded-[20px] p-[2px] bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
  //         <div className="w-full h-full rounded-[18px] bg-gray-900"></div>
  //       </div>
  //     );
  //  }
  return (
    <>
      {/* Thumbnail with play button */}
      <Card
        className="w-16 h-16 rounded p-0 overflow-hidden cursor-pointer border-0 
      shadow-md hover:shadow-lg transition-all"
      >
        <CardContent className="p-0 relative h-full">
          <div
            onClick={handleThumbnailClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="h-16 w-full relative aspect-video"
          >
            <video
              ref={videoRef}
              className=" w-full h-full object-cover"
              loop
              autoPlay={isHovered}
              muted
              playsInline
              src={fullVideoUrl}
            />

            {/* Overlay with play button */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity hover:bg-black/50">
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-md"
              >
                <Play className="h-4 w-4 fill-white" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
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

            <Card className="w-full overflow-hidden shadow-lg pb-0">
              <CardContent className="p-0 relative">
                {/* Loading indicator */}
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                )}

                {/* Video player */}
                <div className="relative aspect-video">
                  <video
                    ref={popupVideoRef}
                    className={`w-full h-full transition-opacity duration-500 ${
                      isVideoLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    autoPlay
                    controls
                    onLoadedData={handleVideoLoad}
                    src={fullVideoUrl}
                    controlsList="nodownload"
                  />
                </div>

                {/* Video caption */}
                {alt && (
                  <div className="p-4 bg-muted border-t">
                    <p className="text-sm text-center font-medium">{alt}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

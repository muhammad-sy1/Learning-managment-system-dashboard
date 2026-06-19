"use client";

import type React from "react";

import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  Pause,
  Play,
  X,
} from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

interface ImageData {
  image: string;
  alt?: string;
  color?: string | null;
}

interface GalleryData {
  name?: string;
  images?: ImageData[];
}

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  fill?: boolean;
  priority?: boolean;
  color?: string;
}

interface ElegantMiniSwiperProps {
  images: ImageData[];
  onOpenDialog: (index: number) => void;
  name?: string;
}

interface LuxuryGalleryDialogProps {
  images: ImageData[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  name?: string;
}

interface ImageGalleryTableCellProps {
  data?: GalleryData;
  alt?: string;
  size?: "sm" | "md" | "lg";
  maxDisplay?: number;
}

const CONFIG = {
  IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_URL || "",
  AUTO_PLAY_INTERVAL: 3000,
  MINI_AUTO_PLAY_INTERVAL: 2500,
  ANIMATION_DURATION: 300,
} as const;

const SafeImage = memo<SafeImageProps>(
  ({
    src,
    alt,
    className = "",
    onLoad,
    onError,
    fill = true,
    priority = false,
    color = "",
    ...props
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const placeholder = useMemo(
      () =>
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8fafc'%3E%3Crect width='300' height='200' fill='%23f1f5f9'/%3E%3Cpath d='M150 100L120 70L90 130L75 115L60 140' stroke='%23cbd5e1' strokeWidth='2' fill='none'/%3E%3Ccircle cx='150' cy='100' r='30' fill='%23e2e8f0'/%3E%3C/svg%3E",
      [],
    );

    const handleLoad = useCallback(() => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }, [onError]);

    const imageUrl = useMemo(() => {
      if (!src || src === "null" || src === "undefined" || hasError) {
        return placeholder;
      }
      const baseUrl = CONFIG.IMAGE_BASE_URL.endsWith("/")
        ? CONFIG.IMAGE_BASE_URL.slice(0, -1)
        : CONFIG.IMAGE_BASE_URL;
      const imagePath = src.startsWith("/") ? src : `/${src}`;

      return src.startsWith("http") ? src : `${baseUrl}${imagePath}`;
    }, [src, hasError, placeholder]);

    return (
      <div className={`relative overflow-hidden ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse z-10">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={alt}
          fill={fill}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          className={`object-contain transition-all duration-500 ease-out ${
            isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          {...props}
        />
        {color && (
          <span
            className="absolute top-2 right-2 w-6 h-6 rounded-full border border-white shadow"
            style={{ backgroundColor: `#${color}` }}
          />
        )}
      </div>
    );
  },
);

SafeImage.displayName = "SafeImage";

const ElegantMiniSwiper = memo<ElegantMiniSwiperProps>(
  ({ images, onOpenDialog, name = "Gallery" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const nextImage = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsAutoPlay(false);
      },
      [images.length],
    );

    const prevImage = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsAutoPlay(false);
      },
      [images.length],
    );

    const toggleAutoPlay = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsAutoPlay(!isAutoPlay);
      },
      [isAutoPlay],
    );

    const handleOpen = useCallback(() => {
      onOpenDialog(currentIndex);
    }, [currentIndex, onOpenDialog]);

    useEffect(() => {
      if (!isAutoPlay || images.length <= 1 || isHovered) return;

      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, CONFIG.MINI_AUTO_PLAY_INTERVAL);

      return () => clearInterval(interval);
    }, [isAutoPlay, images.length, isHovered]);

    if (!images?.length) {
      return (
        <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 flex items-center justify-center group hover:border-slate-300 transition-colors duration-200">
          <ImageIcon
            size={20}
            className="text-slate-400 group-hover:text-slate-500 transition-colors duration-200"
          />
        </div>
      );
    }

    return (
      <div
        className="relative group cursor-pointer"
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label={`عرض معرض الصور لـ ${name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-md border border-slate-200 group-hover:border-slate-300 group-hover:shadow-lg transition-all duration-300 bg-white">
          <SafeImage
            src={images[currentIndex]?.image || ""}
            alt={
              images[currentIndex]?.alt || `${name} - صورة ${currentIndex + 1}`
            }
            className="w-full h-full object-contain
             transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Maximize2 className="text-white drop-shadow-sm" size={14} />
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm border border-slate-200"
                aria-label="الصورة السابقة"
              >
                <ChevronLeft size={10} className="text-slate-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm border border-slate-200"
                aria-label="الصورة التالية"
              >
                <ChevronRight size={10} className="text-slate-700" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <button
              onClick={toggleAutoPlay}
              className="absolute top-1 right-1 w-4 h-4 bg-slate-900/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-900/80"
              aria-label={
                isAutoPlay ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"
              }
            >
              {isAutoPlay ? (
                <Pause size={6} className="text-white" />
              ) : (
                <Play size={6} className="text-white ml-0.5" />
              )}
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-slate-600 scale-125"
                    : "bg-slate-300 group-hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

ElegantMiniSwiper.displayName = "ElegantMiniSwiper";

const LuxuryGalleryDialog = memo<LuxuryGalleryDialogProps>(
  ({ images, isOpen, onClose, initialIndex = 0, name = "Gallery" }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [showThumbnails, setShowThumbnails] = useState(true);
    const [direction, setDirection] = useState<-1 | 0 | 1>(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const nextImage = useCallback(() => {
      setDirection(1);
      setImageLoaded(false);
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsAutoPlay(false);
    }, [images.length]);

    const prevImage = useCallback(() => {
      setDirection(-1);
      setImageLoaded(false);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsAutoPlay(false);
    }, [images.length]);

    const goToImage = useCallback(
      (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setImageLoaded(false);
        setCurrentIndex(index);
        setIsAutoPlay(false);
      },
      [currentIndex],
    );

    useEffect(() => {
      setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
      if (isOpen) {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
      } else {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        if (scrollY) {
          window.scrollTo(0, Number.parseInt(scrollY || "0") * -1);
        }
      }

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isAutoPlay || !isOpen || images.length <= 1) return;

      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, CONFIG.AUTO_PLAY_INTERVAL);

      return () => clearInterval(interval);
    }, [isAutoPlay, isOpen, images.length]);

    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            prevImage();
            break;
          case "ArrowRight":
            e.preventDefault();
            nextImage();
            break;
          case "Escape":
            e.preventDefault();
            onClose();
            break;
          case " ":
            e.preventDefault();
            setIsAutoPlay(!isAutoPlay);
            break;
          case "t":
          case "ط":
            e.preventDefault();
            setShowThumbnails(!showThumbnails);
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isAutoPlay, showThumbnails]);

    if (!isOpen || !images?.length) return null;

    return (
      <div
        className="fixed inset-0 z-50 bg-zinc-900/95 backdrop-blur-md flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-zinc-900/90 to-transparent p-4 md:p-6 z-10">
          <div className="flex items-center justify-between text-white">
            <div className="space-y-1 max-w-[70%]">
              <h2
                id="gallery-title"
                className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate"
              >
                {name}
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                صورة {currentIndex + 1} من {images.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
            
             

              <button
                onClick={onClose}
                className="p-2 md:p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                aria-label="إغلاق المعرض"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-6xl max-h-[80vh] mx-auto px-12 md:px-16">
          <div className="relative flex items-center justify-center h-[60vh] md:h-[70vh]">
            <div className="relative w-full h-full max-w-4xl max-h-full rounded-lg overflow-hidden shadow-2xl bg-slate-800/50 backdrop-blur-sm">
              {/* {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-zinc/80 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-white/70 text-sm">
                      جاري تحميل الصورة...
                    </p>
                  </div>
                </div>
              )} */}

              <SafeImage
                src={images[currentIndex]?.image || ""}
                alt={
                  images[currentIndex]?.alt ||
                  `${name} - صورة ${currentIndex + 1}`
                }
                className="w-full h-full  object-contain"
                onLoad={() => {
                  setImageLoaded(true);
                  setDirection(0);
                }}
                onError={() => setImageLoaded(true)}
                priority
                color={images[currentIndex]?.color || ""}
              />

              {/* <div
                className={`absolute inset-0 bg-zinc-900/20 transition-opacity duration-300 ${
                  imageLoaded ? "opacity-0" : "opacity-100"
                }`}
              /> */}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 z-20"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 z-20"
                  aria-label="الصورة التالية"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-zinc-900/90 to-transparent">
          {showThumbnails && images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto max-w-full pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative group transition-all duration-300 ${
                    index === currentIndex ? "scale-110" : "hover:scale-105"
                  }`}
                  aria-label={`انتقال إلى الصورة ${index + 1}`}
                >
                  <div
                    className={`w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentIndex
                        ? "border-slate-400 shadow-lg shadow-slate-500/30"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <SafeImage
                      src={image.image}
                      alt={image.alt || `صورة مصغرة ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-slate-400/20 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

LuxuryGalleryDialog.displayName = "LuxuryGalleryDialog";

export const ImageGalleryTableCell = memo<ImageGalleryTableCellProps>(
  ({ data, alt = "Gallery", size = "md", maxDisplay = 3 }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleOpenDialog = useCallback((index: number) => {
      setSelectedImageIndex(index);
      setIsDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
      setIsDialogOpen(false);
    }, []);

    const sizeClasses = {
      sm: "w-16 h-12",
      md: "w-24 h-16",
      lg: "w-32 h-20",
    } as const;

    const displayImages = useMemo(
      () => data?.images?.slice(0, maxDisplay) || [],
      [data?.images, maxDisplay],
    );

    return (
      <>
        <div className="flex items-center gap-3">
          <div className={sizeClasses[size]}>
            <ElegantMiniSwiper
              images={displayImages}
              onOpenDialog={handleOpenDialog}
              name={data?.name || alt}
            />
          </div>
        </div>

        {data?.images && (
          <LuxuryGalleryDialog
            images={data.images}
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            initialIndex={selectedImageIndex}
            name={data.name || alt}
          />
        )}
      </>
    );
  },
);

ImageGalleryTableCell.displayName = "ImageGalleryTableCell";

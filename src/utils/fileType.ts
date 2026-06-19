// utils/fileType.ts
export const getFileType = (
  fileUrl: string | null | undefined
): "image" | "video" | "unknown" => {
  if (!fileUrl) return "unknown";

  const extension = fileUrl.split(".").pop()?.toLowerCase() || "";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

  const videoExtensions = [
    "mp4",
    "webm",
    "ogg",
    "mov",
    "avi",
    "wmv",
    "flv",
    "mkv",
  ];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "unknown";
  }
};

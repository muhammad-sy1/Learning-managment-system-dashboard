const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

export function resolveProductMediaUrl(path?: string | null) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedBaseUrl = MEDIA_BASE_URL.endsWith("/")
    ? MEDIA_BASE_URL.slice(0, -1)
    : MEDIA_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

export function getEmbeddedVideoUrl(videoUrl?: string | null) {
  const resolvedUrl = resolveProductMediaUrl(videoUrl);

  if (!resolvedUrl) {
    return null;
  }

  try {
    const url = new URL(resolvedUrl);
    const hostname = url.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const shortsId = url.pathname.match(/^\/shorts\/([^/?]+)/)?.[1];

      if (shortsId) {
        return `https://www.youtube.com/embed/${shortsId}`;
      }

      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (hostname === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

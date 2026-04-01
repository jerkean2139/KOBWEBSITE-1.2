import { useEffect } from "react";
import { useLocation } from "wouter";

interface VideoObject {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  video?: VideoObject;
}

const BASE_URL = "https://keanonbiz.com";

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'ref', 'source'
];

function normalizeCanonicalUrl(path: string): string {
  const url = new URL(path, BASE_URL);
  TRACKING_PARAMS.forEach(param => url.searchParams.delete(param));
  const cleanPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
  const queryString = url.searchParams.toString();
  return queryString ? `${BASE_URL}${cleanPath}?${queryString}` : `${BASE_URL}${cleanPath}`;
}

export function SEO({
  title,
  description,
  image,
  noindex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  video,
}: SEOProps) {
  const [location] = useLocation();

  useEffect(() => {
    const canonicalUrl = normalizeCanonicalUrl(location);
    
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = noindex 
      ? "noindex, nofollow" 
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    if (title) {
      document.title = title.includes("KeanOnBiz") ? title : `${title} | KeanOnBiz`;
    }

    if (description) {
      let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (descMeta) descMeta.content = description;
      
      let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
      if (ogDesc) ogDesc.content = description;
      
      let twDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
      if (twDesc) twDesc.content = description;
    }

    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (ogUrl) ogUrl.content = canonicalUrl;
    
    let twUrl = document.querySelector('meta[name="twitter:url"]') as HTMLMetaElement;
    if (twUrl) twUrl.content = canonicalUrl;

    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
      if (ogTitle) ogTitle.content = title;
      
      let twTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
      if (twTitle) twTitle.content = title;
    }

    if (image) {
      const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;
      
      let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
      if (ogImage) ogImage.content = imageUrl;
      
      let twImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
      if (twImage) twImage.content = imageUrl;
    }

    let ogType = document.querySelector('meta[property="og:type"]') as HTMLMetaElement;
    if (ogType) ogType.content = type;

    if (type === "article") {
      if (publishedTime) {
        let pubMeta = document.querySelector('meta[property="article:published_time"]') as HTMLMetaElement;
        if (!pubMeta) {
          pubMeta = document.createElement("meta");
          pubMeta.setAttribute("property", "article:published_time");
          document.head.appendChild(pubMeta);
        }
        pubMeta.content = publishedTime;
      }

      if (modifiedTime) {
        let modMeta = document.querySelector('meta[property="article:modified_time"]') as HTMLMetaElement;
        if (!modMeta) {
          modMeta = document.createElement("meta");
          modMeta.setAttribute("property", "article:modified_time");
          document.head.appendChild(modMeta);
        }
        modMeta.content = modifiedTime;
      }

      if (author) {
        let authMeta = document.querySelector('meta[property="article:author"]') as HTMLMetaElement;
        if (!authMeta) {
          authMeta = document.createElement("meta");
          authMeta.setAttribute("property", "article:author");
          document.head.appendChild(authMeta);
        }
        authMeta.content = author;
      }
    } else {
      const pubMeta = document.querySelector('meta[property="article:published_time"]');
      if (pubMeta) pubMeta.remove();
      
      const modMeta = document.querySelector('meta[property="article:modified_time"]');
      if (modMeta) modMeta.remove();
      
      const authMeta = document.querySelector('meta[property="article:author"]');
      if (authMeta) authMeta.remove();
    }

    const existingVideoSchema = document.querySelector('script[data-video-schema]');
    if (existingVideoSchema) existingVideoSchema.remove();

    if (video) {
      const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": video.name,
        "description": video.description,
        "thumbnailUrl": video.thumbnailUrl.startsWith("http") ? video.thumbnailUrl : `${BASE_URL}${video.thumbnailUrl}`,
        "uploadDate": video.uploadDate,
        ...(video.contentUrl && { "contentUrl": video.contentUrl.startsWith("http") ? video.contentUrl : `${BASE_URL}${video.contentUrl}` }),
        ...(video.embedUrl && { "embedUrl": video.embedUrl }),
        ...(video.duration && { "duration": video.duration }),
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-video-schema", "true");
      script.textContent = JSON.stringify(videoSchema);
      document.head.appendChild(script);
    }
  }, [location, title, description, image, noindex, type, publishedTime, modifiedTime, author, video]);

  return null;
}

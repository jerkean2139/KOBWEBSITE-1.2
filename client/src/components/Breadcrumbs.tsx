import { Link } from "wouter";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbEntry[];
  className?: string;
  variant?: "light" | "dark";
}

export function Breadcrumbs({ items, className, variant = "light" }: BreadcrumbsProps) {
  const baseUrl = "https://keanonbiz.com";

  const schemaItems = items.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.label,
    item: item.href ? `${baseUrl}${item.href}` : undefined,
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems,
  };

  const linkClass =
    variant === "dark"
      ? "text-white/70 hover:text-white transition-colors"
      : "text-gray-500 hover:text-primary transition-colors";

  const pageClass =
    variant === "dark" ? "text-white" : "text-gray-700";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <span key={index} className="inline-flex items-center gap-1.5">
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className={`${pageClass} ${isLast ? "truncate max-w-[200px]" : ""}`}>
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className={linkClass}>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

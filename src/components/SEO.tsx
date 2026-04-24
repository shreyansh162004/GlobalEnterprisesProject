import { Helmet } from "react-helmet-async";

const SITE_URL = "https://globalenterprises.lovable.app";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

const DEFAULT_KEYWORDS = [
  "second hand laptop jabalpur",
  "used laptop shop jabalpur",
  "refurbished laptops jabalpur",
  "buy second hand laptop jabalpur",
  "cheap laptops jabalpur",
  "budget laptops jabalpur",
  "pre owned laptops jabalpur",
  "used computer shop jabalpur",
  "second hand desktop jabalpur",
  "old laptop buy sell jabalpur",
  "global enterprises jabalpur",
  "global enterprises second hand laptop",
  "global enterprises used laptop shop",
  "global enterprises refurbished laptops",
  "global enterprises rasal chowk",
  "global enterprises jain tower jabalpur",
  "best laptop shop global enterprises",
  "buy second hand laptop near me",
  "best used laptop shop near me",
  "used hp laptop jabalpur",
  "used dell laptop jabalpur",
  "used lenovo laptop jabalpur",
  "second hand gaming laptop jabalpur",
  "laptop under 20000 jabalpur",
  "laptop under 30000 jabalpur",
  "electronics shop in jabalpur",
  "computer shop rasal chowk",
  "laptop store near jain tower jabalpur",
  "used laptop near samdariya hotel",
  "best computer shop in jabalpur",
  "laptop shop near me jabalpur",
  "refurbished laptop store madhya pradesh",
  "buy sell exchange laptops",
  "old laptop exchange jabalpur",
  "laptop repair jabalpur",
  "used laptop with warranty jabalpur",
  "computer accessories jabalpur",
  "computer parts shop jabalpur",
  "best second hand laptop shop in jabalpur",
  "trusted used laptop dealer jabalpur",
  "affordable refurbished laptops jabalpur",
  "where to buy used laptops in jabalpur",
  "certified used laptops jabalpur",
  "second hand laptops with warranty jabalpur",
];

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article" | "product";
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SEO = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  keywords = [],
  type = "website",
  jsonLd,
  noindex = false,
}: SEOProps) => {
  const fullUrl = `${SITE_URL}${path}`;
  const allKeywords = Array.from(new Set([...keywords, ...DEFAULT_KEYWORDS])).join(", ");
  const fullTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const fullDesc = description.length > 160 ? description.slice(0, 157) + "..." : description;

  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={fullUrl} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Global Enterprises" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image" content={image} />

      {/* Geo */}
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Jabalpur" />
      <meta name="geo.position" content="23.1687;79.9556" />
      <meta name="ICBM" content="23.1687, 79.9556" />

      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  name: "Global Enterprises",
  alternateName: "Global Enterprises Jabalpur",
  description:
    "Premium second hand and refurbished laptop shop in Jabalpur. Buy used HP, Dell, Lenovo laptops with warranty at best prices.",
  url: SITE_URL,
  telephone: "+91-98765-43210",
  image: DEFAULT_IMAGE,
  logo: DEFAULT_IMAGE,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rasal Chowk, Jain Tower, near Hotel Samdariya",
    addressLocality: "Jabalpur",
    addressRegion: "Madhya Pradesh",
    postalCode: "482001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.1687,
    longitude: 79.9556,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/globalenterprises",
    "https://www.facebook.com/globalenterprises",
  ],
};

export default SEO;
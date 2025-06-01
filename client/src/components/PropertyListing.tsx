import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropertyDetail from "./PropertyDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePropertyStore } from "@/store/usePropertyStore";
import { json } from "stream/consumers";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number | string;
  baths: number | string;
  features: string[];
  isPremium: boolean;
  updatedDate: string;
  imageUrl: string;
  description?: string;
  toilets?: number;
  address?: string;
  detailedFeatures?: string[];
  pid?: string;
  // New structure fields
  bedroom?: string;
  bathrooms?: string;
  details_url?: string;
  image_url?: string;
  listing?: string;
}

// const mockProperties: Property[] = [
//   // New structure property
//   {
//     id: "new-1",
//     title: "Houses for Sale in Lagos",
//     location: "Lagos, Nigeria",
//     price: "₦12,000,000 - ₦250,000,000",
//     beds: "Multiple options",
//     baths: "Multiple options",
//     bedroom: "Multiple options",
//     bathrooms: "Multiple options",
//     features: ["PRIME LOCATION", "VARIOUS OPTIONS", "VERIFIED LISTINGS"],
//     isPremium: true,
//     updatedDate: "Updated 26 May 2025",
//     imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
//     description: "The average price of houses is ₦250,000,000, with prices varying by location and features.",
//     details_url: "https://nigeriapropertycentre.com/for-sale/houses/lagos/showtype",
//     image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
//     listing: "Various listings available",
//     detailedFeatures: [
//       "Prime Locations",
//       "Multiple Property Types",
//       "Verified Listings",
//       "Professional Support",
//       "Legal Documentation",
//       "Property Inspection"
//     ],
//   },
//   {
//     id: "1",
//     title: "5bed Detached+bq!!!",
//     location: "Ikeja GRA Ikeja Lagos",
//     price: "₦ 1,200,000,000",
//     beds: 5,
//     baths: 6,
//     features: ["ALL ROOM ENSUIT", "24 HOURS SECURITY"],
//     isPremium: true,
//     updatedDate: "Updated 10 May 2025, Added 28 Mar 2025",
//     imageUrl:
//       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
//     description:
//       "FOR SALE!!! 5BED DETACHED+BQ!!! LOCATION:IKEJA GRA LAGOS... TITLE:CERTIFICATE OF OCCUPANCY... PRICE:1.2BILLION..",
//     toilets: 6,
//     address: "Ikeja Gra Ikeja Lagos",
//     pid: "2MSPS",
//     detailedFeatures: [
//       "Big Compound",
//       "All Room Ensuit",
//       "Jacuzzi",
//       "CCTV Cameras",
//       "Parking Space",
//       "Water Treatment",
//       "Drainage System",
//       "POP Ceiling",
//       "C of O",
//       "Security",
//     ],
//   },
//   {
//     id: "2",
//     title: "5 Bedroom House",
//     location: "Off Admiralty Way Lekki Phase 1 Lekki Lagos",
//     price: "₦ 1,300,000,000",
//     beds: 5,
//     baths: 5,
//     features: ["SUPERMARKET NEARBY", "ALL ROOM ENSUIT", "24 HOURS SECURITY"],
//     isPremium: true,
//     // updatedDate: "Updated 10 May 2025, Added 13 Jan 2025",
//     imageUrl:
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
//     description:
//       "A beautiful 5 bedroom house in the heart of Lekki Phase 1. Perfect for a family looking for comfort and luxury.",
//     toilets: 5,
//     address: "Off Admiralty Way Lekki Phase 1 Lagos",
//     pid: "1MJKH",
//     detailedFeatures: [
//       "All Room Ensuit",
//       "Swimming Pool",
//       "CCTV Cameras",
//       "Parking Space",
//       "Water Treatment",
//       "C of O",
//     ],
//   },
//   {
//     id: "3",
//     title: "5 Bedroom House",
//     location: "Off Admiralty Way Lekki Phase 1 Lekki Lagos",
//     price: "₦ 1,300,000,000",
//     beds: 5,
//     baths: 5,
//     features: ["SUPERMARKET NEARBY", "ALL ROOM ENSUIT", "24 HOURS SECURITY"],
//     isPremium: true,
//     // updatedDate: "Updated 10 May 2025, Added 13 Jan 2025",
//     imageUrl:
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
//     description:
//       "A beautiful 5 bedroom house in the heart of Lekki Phase 1. Perfect for a family looking for comfort and luxury.",
//     toilets: 5,
//     address: "Off Admiralty Way Lekki Phase 1 Lagos",
//     pid: "1MJKH",
//     detailedFeatures: [
//       "All Room Ensuit",
//       "Swimming Pool",
//       "CCTV Cameras",
//       "Parking Space",
//       "Water Treatment",
//       "C of O",
//     ],
//   },
//   {
//     id: "5",
//     title: "5 Bedroom House",
//     location: "Off Admiralty Way Lekki Phase 1 Lekki Lagos",
//     price: "₦ 1,300,000,000",
//     beds: 5,
//     baths: 5,
//     features: ["SUPERMARKET NEARBY", "ALL ROOM ENSUIT", "24 HOURS SECURITY"],
//     isPremium: true,
//     // updatedDate: "Updated 10 May 2025, Added 13 Jan 2025",
//     imageUrl:
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
//     description:
//       "A beautiful 5 bedroom house in the heart of Lekki Phase 1. Perfect for a family looking for comfort and luxury.",
//     toilets: 5,
//     address: "Off Admiralty Way Lekki Phase 1 Lagos",
//     pid: "1MJKH",
//     detailedFeatures: [
//       "All Room Ensuit",
//       "Swimming Pool",
//       "CCTV Cameras",
//       "Parking Space",
//       "Water Treatment",
//       "C of O",
//     ],
//   },
//   {
//     id: "4",
//     title: "5 Bedroom House",
//     location: "Off Admiralty Way Lekki Phase 1 Lekki Lagos",
//     price: "₦ 1,300,000,000",
//     beds: 5,
//     baths: 5,
//     features: ["SUPERMARKET NEARBY", "ALL ROOM ENSUIT", "24 HOURS SECURITY"],
//     isPremium: true,
//     // updatedDate: "Updated 10 May 2025, Added 13 Jan 2025",
//     imageUrl:
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
//     description:
//       "A beautiful 5 bedroom house in the heart of Lekki Phase 1. Perfect for a family looking for comfort and luxury.",
//     toilets: 5,
//     address: "Off Admiralty Way Lekki Phase 1 Lagos",
//     pid: "1MJKH",
//     detailedFeatures: [
//       "All Room Ensuit",
//       "Swimming Pool",
//       "CCTV Cameras",
//       "Parking Space",
//       "Water Treatment",
//       "C of O",
//     ],
//   },
// ];

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

const PropertyCard = ({ property, onSelect }: PropertyCardProps) => {
  return (
    <Card
      className="overflow-hidden mb-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
      onClick={() => onSelect(property)}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="relative lg:w-2/5 h-64 lg:h-56">
          <img
            src={property?.imageUrl || property?.image_url}
            alt={property?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {/* <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
            28 Photos
          </div> */}
          {/* {property?.isPremium && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white font-medium py-1 px-3 shadow-lg">
                ⭐ PREMIUM
              </Badge>
            </div>
          )} */}
        </div>

        {/* Content Section */}
        <div className="flex-1 bg-white bg-opacity-10 p-6 flex flex-col justify-between text-white">
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-purple-600 transition-colors mb-2 underline">
                {property?.title}
              </h3>
              <p className="flex items-center text-white mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {property?.location}
              </p>
              <p className="text-sm text-white mb-3">
                {property?.listing ||
                  `${
                    property?.bedroom || property?.beds
                  } Bedroom House / House FOR Sale`}
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-white">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z"
                    />
                  </svg>
                  {property?.bedroom || property?.beds} Beds
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                  {property?.bathrooms || property?.baths} Baths
                </span>
              </div>
              {property?.pid && (
                <p className="text-xs text-white">PID: {property?.pid}</p>
              )}
            </div>
            <div className="text-left mt-2">
              <p className="text-xl font-bold text-purple-700 mb-1">
                {property?.price}
              </p>
              <div className="flex items-center text-xs text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View Details
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const PropertyListing = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const properties = usePropertyStore((store) => store.properties);
  useEffect(() => console.log(properties, 32233), [properties]);

  // If properties from store is empty, use mockProperties
  const displayProperties = properties.length > 0 ? properties : [];
  console.log(displayProperties, 32233, "display properties");

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleBackToListing = () => {
    setSelectedProperty(null);
  };

  return (
    <ScrollArea className="h-full w-full">
      {selectedProperty ? (
        <PropertyDetail
          property={selectedProperty}
          onBack={handleBackToListing}
        />
      ) : (
        <div className="w-full mx-auto py-6">
          {displayProperties.length !== 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-purple-600">
                Available Properties
              </h2>
              <div className="space-y-6">
                {displayProperties.map((property) => (
                  <PropertyCard
                    key={property?.id}
                    property={property}
                    onSelect={handleSelectProperty}
                  />
                  // <>{JSON.stringify(property)}</>
                ))}
              </div>
            </>
          )}

          {/* If no properties are available, show a message */}
          {displayProperties.length === 0 && (
            <div className="text-center text-white">
              No properties available.
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

export default PropertyListing;

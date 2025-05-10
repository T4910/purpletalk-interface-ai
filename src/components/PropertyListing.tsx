
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneCall, MessageSquare } from "lucide-react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  features: string[];
  isPremium: boolean;
  updatedDate: string;
  imageUrl: string;
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "5bed Detached+bq!!!",
    location: "Ikeja GRA Ikeja Lagos",
    price: "₦ 1,200,000,000",
    beds: 5,
    baths: 6,
    features: ["ALL ROOM ENSUIT", "24 HOURS ELECTRICITY", "24 HOURS SECURITY"],
    isPremium: true,
    updatedDate: "Updated 10 May 2025, Added 28 Mar 2025",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  },
  {
    id: "2",
    title: "5 Bedroom House",
    location: "Off Admiralty Way Lekki Phase 1 Lekki Lagos",
    price: "₦ 1,300,000,000",
    beds: 5,
    baths: 5,
    features: ["SUPERMARKET NEARBY", "ALL ROOM ENSUIT", "24 HOURS SECURITY"],
    isPremium: true,
    updatedDate: "Updated 10 May 2025, Added 13 Jan 2025",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  }
];

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <Card className="overflow-hidden mb-6 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-72 h-52">
          <img 
            src={property.imageUrl} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-purple-600 text-white text-xs py-1 px-2">
              MUST SEE
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 bg-gray-800/70 text-white px-2 py-1 rounded text-xs">
            28
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium">{property.title}</h3>
              <p className="text-sm text-muted-foreground">{property.location}</p>
              <p className="text-xs text-muted-foreground mt-1">{property.id === "1" ? "5bed Detached+bq!!! / House FOR Sale" : "5 Bedroom House / House FOR Sale"}</p>
              
              <div className="flex gap-2 mt-3">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold">{property.price}</p>
              <p className="text-xs text-muted-foreground">PID: {property.id === "1" ? "2MSPS" : "1MJKH"}</p>
              <div className="flex items-center mt-2 justify-end">
                <p className="text-sm">{property.beds} Beds {property.baths} Baths</p>
              </div>
              
              <div className="mt-8">
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
                  Premium Gold
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4 items-end">
            <div className="text-xs text-muted-foreground">
              {property.updatedDate}
            </div>
            
            <div className="flex gap-2">
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-md">
                <PhoneCall size={16} className="mr-2" /> Call
              </Button>
              <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600 border-none rounded-md">
                <MessageSquare size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const PropertyListing = () => {
  return (
    <div className="space-y-4">
      {mockProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyListing;

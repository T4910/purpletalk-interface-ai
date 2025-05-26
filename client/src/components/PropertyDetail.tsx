import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, ExternalLink, Share, MapPin, Phone, MessageSquare, Car, Shield, Wifi } from "lucide-react";
import { Property } from "./PropertyListing";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
}

const PropertyDetail = ({ property, onBack }: PropertyDetailProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite 
        ? "Property removed from favorites" 
        : "Property added to favorites"
    );
  };

  const handleShareProperty = () => {
    toast.success("Share link copied to clipboard");
  };

  return (
    <div className="w-full mx-auto">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          className="p-2" 
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to listings
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`rounded-full ${isFavorite ? 'text-red-500 border-red-500' : ''}`}
            onClick={handleToggleFavorite}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Link to={`${property.details_url}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main image and gallery */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img 
          src={property.imageUrl || property.image_url} 
          alt={property.title} 
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* {property.isPremium && (
          <div className="absolute top-6 left-6">
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white font-medium py-2 px-4 text-sm shadow-lg">
              ⭐ PREMIUM LISTING
            </Badge>
          </div>
        )}
        <div className="absolute bottom-6 right-6 bg-black/60 text-white px-3 py-2 rounded-lg text-sm font-medium">
          1 / 28 Photos
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Header */}
          <div>
            <h1 className="text-3xl font-bold text-purple-600 mb-3">{property.title}</h1>
            <div className="flex items-center text-white mb-4">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              <span className="text-lg">{property.location}</span>
            </div>
            <p className="text-white text-lg">{property.listing || "Property for sale"}</p>
          </div>

          {/* Price and Key Stats */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-6">
            <div className="flex max-md:flex-col align-center justify-between gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700 mb-1">{property.price}</div>
                <div className="text-sm text-white">Total Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{property.bedroom || property.beds}</div>
                <div className="text-sm text-white">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{property.bathrooms || property.baths}</div>
                <div className="text-sm text-white">Bathrooms</div>
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div className="bg-white bg-opacity-10 rounded-xl border border-white p-6">
            <h2 className="text-2xl font-semibold mb-4">About this property</h2>
            <p className="text-white leading-relaxed">{property.description || "No description available for this property."}</p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default PropertyDetail;

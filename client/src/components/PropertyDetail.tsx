
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, ExternalLink, Share } from "lucide-react";
import { Property } from "./PropertyListing";
import { toast } from "sonner";

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
    <div className="pb-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-sm"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back to search results
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${isFavorite ? 'text-red-500' : ''}`}
            onClick={handleToggleFavorite}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={handleShareProperty}
          >
            <Share size={20} />
          </Button>
          
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full h-9 w-9 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-indigo-900 mb-2">
        {property.title}
      </h1>
      
      <p className="text-muted-foreground mb-4">{property.location}</p>
      
      <div className="relative rounded-lg overflow-hidden mb-6">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-80 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-purple-600 text-white px-3 py-1">
            MUST SEE
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white rounded-full px-3 py-1 text-sm">
          1/29
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-indigo-900">{property.price}</span>
          <span className="text-sm text-muted-foreground">Price</span>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center justify-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-900 mr-1">{property.beds}</span>
            <span className="text-sm text-muted-foreground">Beds</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-900 mr-1">{property.baths}</span>
            <span className="text-sm text-muted-foreground">Baths</span>
          </div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-indigo-900">{property.toilets}</span>
          <span className="text-sm text-muted-foreground">Toilets</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Property address</h2>
        <p>{property.address}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            Last updated {new Date().toLocaleDateString()}
          </span>
          <span className="text-sm font-medium">PID: {property.pid}</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Description</h2>
        <p className="text-muted-foreground">{property.description}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.detailedFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-600"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-md">
          Enquire
        </Button>
        <Button variant="outline" className="flex-1 bg-green-500 text-white hover:bg-green-600 border-none rounded-md">
          Whatsapp
        </Button>
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center">
        <div className="bg-blue-500 rounded-full p-2 mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="white"/>
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-blue-800">Property is verified as real</h3>
          <p className="text-sm text-blue-600">If reported as fake, we'll investigate to confirm if this listing isn't real.</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

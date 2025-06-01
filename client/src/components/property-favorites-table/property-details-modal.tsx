import { memo, useCallback } from "react";
import {
  XIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  HistoryIcon,
  MoreVerticalIcon,
  ClockIcon,
  DollarSignIcon,
  CheckCircleIcon,
  BedIcon,
  BathIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  HomeIcon,
  InfoIcon,
  TrashIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/lib/store/modal-store";
import { formatDate, getTimeSince } from "@/lib/utils/format-utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Property } from "@/lib/store/table-store";

interface PropertyDetailsModalProps {
  onDelete: (id: number) => void;
  onRefresh: (id: number) => Promise<void>;
}

// Header component for both modal and drawer
const PropertyDetailsHeader = memo(function PropertyDetailsHeader({
  property,
  scrapedTime,
  scrapeHistory,
  isRefreshing,
  onRefresh,
  onDelete,
  onClose,
}: {
  property: Property;
  scrapedTime: string;
  scrapeHistory: string[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const handleGoToProperty = useCallback(() => {
    window.open(property.details_url, "_blank");
  }, [property]);

  return (
    <div className="flex flex-row flex-wrap items-center justify-between space-y-0 pb-4 border-b ">
      <h2 className="text-lg md:text-xl font-semibold text-white text-wrap text-left runcate mr-4 flex-1">
        {property.title}
      </h2>

      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Scraped time indicator */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 glass-morphism px-2 py-1 rounded">
          <ClockIcon size={12} />
          Updated {scrapedTime}
        </div>

        {/* History dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white max-sm:hidden"
            >
              <HistoryIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-morphism border-slate-700">
            <div className="px-2 py-1 text-xs font-medium text-slate-400">
              Scrape History
            </div>
            <DropdownMenuSeparator className="bg-slate-700" />
            {scrapeHistory.map((date, index) => (
              <DropdownMenuItem
                key={index}
                className="text-slate-300 focus:bg-slate-700"
              >
                {date}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Refresh button */}
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-slate-400 hover:text-white max-sm:hidden"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCwIcon
            size={16}
            className={isRefreshing ? "animate-spin" : ""}
          />
        </Button>

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <MoreVerticalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-morphism border-slate-700">
            <DropdownMenuItem
              onClick={onRefresh}
              className="text-slate-300 focus:bg-slate-700 sm:hidden"
            >
              <RefreshCwIcon size={14} className="mr-2" />
              Refresh Property
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleGoToProperty}
              className="text-slate-300 focus:bg-slate-700"
            >
              <ExternalLinkIcon size={14} className="mr-2" />
              Go to Property
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-400 focus:bg-red-900/20 focus:text-red-300"
            >
              <TrashIcon size={14} className="mr-2" />
              Delete Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

// Content component for both modal and drawer
const PropertyDetailsContent = memo(function PropertyDetailsContent({
  property,
  scrapedTime,
}: {
  property: Property;
  scrapedTime: string;
}) {
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(90vh-120px)]">
      {/* Mobile: Scraped time indicator */}
      <div className="sm:hidden max-md:ml-4 flex items-center gap-1 text-xs text-slate-400 glass-morphism px-3 py-2 rounded w-fit">
        <ClockIcon size={12} />
        Updated {scrapedTime}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
        {/* Left side - Property Image */}
        <div className="space-y-6 lg:flex lg:flex-col lg:justify-between order-2 lg:order-1">
          <div className="relative rounded-lg overflow-hidden glass-morphism">
            <img
              src={
                property.image_url ||
                property.extra_data.image_url ||
                "/placeholder.svg?height=300&width=400"
              }
              alt={property.title}
              className="w-full h-48 md:h-64 lg:h-80 object-cover"
              loading="lazy"
            />
          </div>

          {/* Quick stats below image */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="glass-morphism p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <BedIcon className="size-3.5 md:size-4" />
                <span className="text-xs md:text-sm font-medium">Bedrooms</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">
                {property.bedroom || property.extra_data.bedroom || "-"}
              </div>
            </div>
            <div className="glass-morphism p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <BathIcon className="size-3.5 md:size-4" />
                <span className="text-xs md:text-sm font-medium">
                  Bathrooms
                </span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">
                {property.bathroom || property.extra_data.bathrooms || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Property Details */}
        <div className="space-y-4 md:space-y-6 order-3 lg:order-2">
          {/* Price and Property Type */}
          <div className="glass-morphism p-3 md:p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <DollarSignIcon className="size-3.5 md:size-4" />
              <span className="text-xs md:text-sm font-medium">Price</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
              {property.price ||
                property.extra_data.price ||
                "Price on request"}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <HomeIcon className="size-3 md:size-3.5" />
              <span className="text-xs md:text-sm">
                {property.property_type}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="glass-morphism p-3 md:p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <MapPinIcon className="size-3.5 md:size-4" />
              <span className="text-xs md:text-sm font-medium">Location</span>
            </div>
            <div className="text-sm md:text-base text-white">
              {property.location}
            </div>
          </div>

          {/* Listing Date */}
          {(property.listing_time || property.extra_data.listing) && (
            <div className="glass-morphism p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <CalendarIcon className="size-3.5 md:size-4" />
                <span className="text-xs md:text-sm font-medium">Listed</span>
              </div>
              <div className="text-sm md:text-base text-white">
                {formatDate(
                  property.listing_time || property.extra_data.listing
                )}
              </div>
            </div>
          )}

          {/* Agent Contact */}
          {property.extra_data.phonenumber && (
            <div className="glass-morphism p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <PhoneIcon className="size-3.5 md:size-4" />
                <span className="text-xs md:text-sm font-medium">
                  Agent Contact
                </span>
              </div>
              <a
                href={`tel:${property.extra_data.phonenumber}`}
                className="text-sm md:text-base text-green-400 hover:text-green-300 transition-colors"
              >
                {property.extra_data.phonenumber}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Full width sections */}
      <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-4 md:space-y-6">
        {/* Description */}
        <div className="glass-morphism p-3 md:p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-400 mb-3">
            <InfoIcon className="size-3.5 md:size-4" />
            <span className="text-sm md:text-base font-medium">
              Description
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {property.description || property.extra_data.description}
          </p>
        </div>

        {/* Amenities */}
        {(property.amenities || property.extra_data.amenities) && (
          <div className="glass-morphism p-3 md:p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <CheckCircleIcon className="size-3.5 md:size-4" />
              <span className="text-sm md:text-base font-medium">
                Amenities
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {(property.amenities || property.extra_data.amenities)?.map(
                (amenity: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-slate-700/50 text-slate-300 border-slate-600 justify-start text-xs"
                  >
                    {amenity}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const PropertyDetailsModal = memo(function PropertyDetailsModal({
  onDelete,
  onRefresh,
}: PropertyDetailsModalProps) {
  const {
    isOpen,
    closeModal,
    selectedProperty,
    isRefreshing,
    setIsRefreshing,
    scrapeHistory,
  } = useModalStore();
  const isMobile = useIsMobile();

  const handleRefresh = useCallback(async () => {
    if (!selectedProperty) return;
    setIsRefreshing(true);
    try {
      await onRefresh(selectedProperty.id);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedProperty, onRefresh, setIsRefreshing]);

  const handleDelete = useCallback(() => {
    if (!selectedProperty) return;
    onDelete(selectedProperty.id);
    closeModal();
  }, [selectedProperty, onDelete, closeModal]);

  if (!selectedProperty) return null;

  const scrapedTime = getTimeSince(selectedProperty.scraped_at);
  const property = selectedProperty;

  const headerProps = {
    property,
    scrapedTime,
    scrapeHistory,
    isRefreshing,
    onRefresh: handleRefresh,
    onDelete: handleDelete,
    onClose: closeModal,
  };

  const contentProps = {
    property,
    scrapedTime,
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={closeModal}>
        <DrawerContent className="rounded-lg border shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card text-white max-h-[95vh]">
          <DrawerHeader className="p-4">
            <PropertyDetailsHeader {...headerProps} />
          </DrawerHeader>
          <PropertyDetailsContent {...contentProps} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-6xl max-h-[90vh] rounded-lg border shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card text-white overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <PropertyDetailsHeader {...headerProps} />
        </DialogHeader>
        <PropertyDetailsContent {...contentProps} />
      </DialogContent>
    </Dialog>
  );
});

export default PropertyDetailsModal;

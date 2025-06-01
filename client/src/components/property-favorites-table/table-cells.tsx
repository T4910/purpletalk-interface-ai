import { memo } from "react";
import {
  BedIcon,
  BathIcon,
  MapPinIcon,
  CalendarIcon,
  HomeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils/format-utils";
import type { Property } from "@/lib/store/table-store";

// Expander Cell
export const ExpanderCell = memo(function ExpanderCell({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      className="size-7 shadow-none text-slate-400 hover:text-white hover:bg-slate-700"
      onClick={onToggle}
      aria-expanded={isExpanded}
      size="icon"
      variant="ghost"
    >
      {isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
    </Button>
  );
});

// Checkbox Cell
export const CheckboxCell = memo(function CheckboxCell({
  checked,
  onCheckedChange,
  indeterminate = false,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
}) {
  return (
    <Checkbox
      checked={indeterminate ? "indeterminate" : checked}
      onCheckedChange={onCheckedChange}
      aria-label={
        indeterminate
          ? "Some rows selected"
          : checked
          ? "Deselect all rows"
          : "Select all rows"
      }
      className="border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
    />
  );
});

// Title Cell
export const TitleCell = memo(function TitleCell({
  title,
  onOpenModal,
  isMobile,
}: {
  title: string;
  onOpenModal: () => void;
  isMobile?: boolean;
}) {
  return (
    <button
      onClick={onOpenModal}
      className={`font-medium text-white ${
        isMobile ? "max-w-[240px]" : "max-w-[200px]"
      } truncate hover:text-purple-300 transition-colors text-left underline`}
    >
      {title}
    </button>
  );
});

// Address Cell
export const AddressCell = memo(function AddressCell({
  location,
}: {
  location: string;
}) {
  return (
    <div className="text-slate-300 max-w-[180px] truncate flex items-center gap-1">
      <MapPinIcon size={14} className="text-slate-400 shrink-0" />
      {location}
    </div>
  );
});

// Property Type Cell
export const PropertyTypeCell = memo(function PropertyTypeCell({
  type,
}: {
  type: string;
}) {
  return (
    <div className="text-slate-300 flex items-center gap-1">
      <HomeIcon size={14} className="text-slate-400" />
      {type}
    </div>
  );
});

// Listing Date Cell
export const ListingDateCell = memo(function ListingDateCell({
  listingTime,
}: {
  listingTime: string | null | undefined;
}) {
  const formattedDate = formatDate(listingTime);

  if (formattedDate === "-") {
    return <span className="text-slate-500">-</span>;
  }

  return (
    <div className="text-slate-300 flex items-center gap-1">
      <CalendarIcon size={14} className="text-slate-400" />
      {formattedDate}
    </div>
  );
});

// Bedroom Cell
export const BedroomCell = memo(function BedroomCell({
  bedrooms,
}: {
  bedrooms: number | null;
}) {
  if (!bedrooms) return <span className="text-slate-500">-</span>;

  return (
    <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 hover:bg-purple-600/30">
      <BedIcon size={12} className="mr-1" />
      {bedrooms}
    </Badge>
  );
});

// Bathroom Cell
export const BathroomCell = memo(function BathroomCell({
  bathrooms,
}: {
  bathrooms: number | null;
}) {
  if (!bathrooms) return <span className="text-slate-500">-</span>;

  return (
    <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 hover:bg-blue-600/30">
      <BathIcon size={12} className="mr-1" />
      {bathrooms}
    </Badge>
  );
});

// Price Cell
export const PriceCell = memo(function PriceCell({
  price,
}: {
  price: string | null;
}) {
  if (!price) return <div className="text-right text-slate-500">-</div>;

  return <div className="text-right font-semibold text-green-400">{price}</div>;
});

// Expanded Row Content
export const ExpandedRowContent = memo(function ExpandedRowContent({
  property,
}: {
  property: Property;
}) {
  const description = property.description || property.extra_data.description;
  const amenities = property.amenities || property.extra_data.amenities;
  const phoneNumber = property.extra_data.phonenumber;

  return (
    <div className="py-4 space-y-4">
      {/* Description */}
      <div className="flex items-start gap-3">
        <HomeIcon className="text-purple-400 mt-0.5 shrink-0" size={16} />
        <div>
          <h4 className="text-sm font-medium text-white mb-1">Description</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Amenities */}
      {amenities && amenities.length > 0 && (
        <div className="flex items-start gap-3">
          <HomeIcon className="text-blue-400 mt-0.5 shrink-0" size={16} />
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact */}
      {phoneNumber && (
        <div className="flex items-start gap-3">
          <MapPinIcon className="text-green-400 mt-0.5 shrink-0" size={16} />
          <div>
            <h4 className="text-sm font-medium text-white mb-1">
              Agent Contact
            </h4>
            <a
              href={`tel:${phoneNumber}`}
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              {phoneNumber}
            </a>
          </div>
        </div>
      )}
    </div>
  );
});

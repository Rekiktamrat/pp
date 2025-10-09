import React from "react";

const PropertyViewModal = ({ property, onClose }) => {
  if (!property) return null;

  // Address formatting
  const region = property?.address?.region || "-";
  const subregion = property?.address?.subregion?.subregion_name || "-";
  const location = property?.address?.location?.location || "-";

  // Images
  const images = property?.images || [];
  const coverImage = images[0];
  const thumbnails = images.slice(1);

  // Type-specific fields
  const bedrooms = property?.typeSpecificFields?.bedrooms;
  const bathrooms = property?.typeSpecificFields?.bathrooms;

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-0 flex flex-col" style={{ maxHeight: '90vh' }}>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <div className="overflow-y-auto p-6" style={{ maxHeight: '80vh' }}>
        {/* Cover Image */}
        {coverImage && (
          <img
            src={coverImage}
            alt="Property Cover"
            className="w-full h-56 object-cover rounded-md mb-4"
          />
        )}

        {/* Title & Description */}
        <h2 className="text-2xl font-bold mb-2 text-blue-700">{property.title}</h2>
        <p className="text-gray-700 mb-4">{property.description}</p>

        {/* Price & Type */}
        <div className="flex flex-wrap gap-6 mb-4">
          <div>
            <span className="font-semibold text-gray-600">Price:</span>
            <span className="ml-2 text-lg text-green-600">${property.price}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Type:</span>
            <span className="ml-2">{property?.propertyType?.name || "-"}</span>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="flex gap-6 mb-4">
          <div>
            <span className="font-semibold text-gray-600">Bedrooms:</span>
            <span className="ml-2">{bedrooms ?? "-"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Bathrooms:</span>
            <span className="ml-2">{bathrooms ?? "-"}</span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <span className="font-semibold text-gray-600">Address:</span>
          <span className="ml-2">{region} &rarr; {subregion} &rarr; {location}</span>
        </div>

        {/* Owner */}
        <div className="mb-4">
          <span className="font-semibold text-gray-600">Owner:</span>
          <span className="ml-2">{property?.owner?.name || "-"}</span>
          <span className="ml-4 font-semibold text-gray-600">Phone:</span>
          <span className="ml-2">{property?.owner?.phone || "-"}</span>
        </div>

        {/* Thumbnails */}
        {thumbnails.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold text-gray-600">More Images:</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {thumbnails.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyViewModal;

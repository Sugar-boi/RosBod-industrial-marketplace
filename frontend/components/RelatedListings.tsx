"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";
import ListingSection from "@/components/ListingSection";

export default function RelatedListings({
  listingId,
}: {
  listingId: number;
}) {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/listings/${listingId}/related`
      );

      const data = await res.json();

      setListings(data);
    };

    fetchRelated();
  }, [listingId]);

  if (listings.length === 0) {
    return null;
  }

  return (
    <ListingSection
      title="Related Listings"
      link="/listings"
      listings={listings}
    />
  );
}
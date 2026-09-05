"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import API_BASE_URL from "@/lib/api-config";

import AuctionCountdown from "../components/AuctionCountdown";
import BidHistory from "../components/BidHistory";
import AuctionStatusCard from "../components/AuctionStatusCard";

// Adjust this import only if your ImageGallery lives elsewhere.
import ImageGallery from "@/app/listings/[id]/components/ImageGallery";

export default function AuctionPage() {
  const { id } = useParams();

  const [auction, setAuction] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [bidAmount, setBidAmount] =
    useState("");

  const [bidLoading, setBidLoading] =
    useState(false);

  const loadAuction = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/auctions/${id}`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to load auction"
        );
      }

      // const data =        await res.json();
      const data = await res.json();

      // Normalize listing so ImageGallery and seller UI work
      if (data.listing) {
        data.listing = {
          ...data.listing,
          images: data.listing.images || data.listing.listingimage || [],
          seller: data.listing.seller || data.listing.user || null,
        };
      }

      setAuction(data);
      setAuction(data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuction();
  }, [id]);

  useEffect(() => {
    const interval =
      setInterval(
        loadAuction,
        5000
      );

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  const handleBid = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!bidAmount) {
        alert(
          "Enter your bid."
        );

        return;
      }

      setBidLoading(true);

      const res =
        await fetch(
          `${API_BASE_URL}/api/auctions/${id}/bid`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                amount:
                  Number(
                    bidAmount
                  ),
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to place bid"
        );
      }

      alert(
        "Bid placed successfully!"
      );

      setBidAmount("");

      await loadAuction();

    } catch (err: any) {
      alert(
        err.message ||
        "Failed to place bid"
      );

    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          bg-[#f7f7f5]
          p-6
        "
      >
        <p
          className="
            text-sm
            font-semibold
            text-gray-500
          "
        >
          Loading auction...
        </p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div
        className="
          p-10
          text-center
        "
      >
        Auction not found.
      </div>
    );
  }

  const listing =
    auction.listing;

  const now =
    new Date();

  const startDate =
    new Date(
      auction.startDate
    );

  const endDate =
    new Date(
      auction.endDate
    );

  const isUpcoming =
    now < startDate;

  const isEnded =
    now >= endDate;

  const isSold =
    listing?.isSold;

  const auctionStatus =
    isSold
      ? "SOLD"
      : isEnded
        ? "ENDED"
        : isUpcoming
          ? "UPCOMING"
          : "LIVE";

  const canBid =
    !isUpcoming &&
    !isEnded &&
    !isSold;

  const minimumBid =
    Math.max(
      Number(
        auction.currentBid || 0
      ) +
      Number(
        auction.minimumIncrement || 0
      ),

      Number(
        auction.startingBid || 0
      )
    );

  const scrollToSection = (
    sectionId: string
  ) => {
    document
      .getElementById(
        sectionId
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <main
      className="
    min-h-screen
    bg-[#f7f7f5]
    pb-24
    lg:pb-0
  "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-5
          sm:px-6
          lg:px-8
          lg:py-7
        "
      >
        {/* BREADCRUMB */}

        <div
          className="
            mb-4
            flex
            flex-wrap
            items-center
            gap-2
            text-[10px]
            text-gray-400
            sm:text-xs
          "
        >
          <span>
            Home
          </span>

          <span>
            /
          </span>

          <span>
            Auctions
          </span>

          <span>
            /
          </span>

          <span
            className="
              max-w-[220px]
              truncate
              font-medium
              text-gray-600
            "
          >
            {listing?.title}
          </span>
        </div>

        {/* MOBILE/TABLET TITLE */}

        <div
          className="
            mb-5
            lg:hidden
          "
        >
          <div
            className="
    mt-2
    lg:hidden
  "
          >
            <AuctionCountdown
              startDate={
                auction.startDate
              }
              endDate={
                auction.endDate
              }
            />
          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                rounded-full
                bg-green-50
                px-2.5
                py-1
                text-[9px]
                font-extrabold
                uppercase
                tracking-wide
                text-green-700
              "
            >
              {auctionStatus === "SOLD"
                ? "Sold"
                : auctionStatus === "ENDED"
                  ? "Ended"
                  : auctionStatus === "UPCOMING"
                    ? "Upcoming"
                    : "Live Auction"}
            </span>

            {listing?.category?.name && (
              <span
                className="
                  text-xs
                  font-medium
                  text-gray-500
                "
              >
                {listing.category.name}
              </span>
            )}
          </div>

          <h1
            className="
              mt-3
              text-2xl
              font-extrabold
              leading-tight
              text-[#24272b]
              sm:text-3xl
            "
          >
            {listing?.title}
          </h1>
        </div>

        {/* DESKTOP MAIN LAYOUT */}

        <div
          className="
            grid
            gap-6
            lg:grid-cols-[minmax(0,1fr)_330px]
            lg:items-start
          "
        >
          {/* LEFT CONTENT */}

          <div
            className="
              min-w-0
            "
          >
            {/* IMAGE GALLERY */}

            <section>
              <ImageGallery
                images={
                  listing?.images || []
                }
              />
            </section>

            {/* SECTION NAV */}

            <nav
              className="
                mt-4
                overflow-x-auto
                rounded-xl
                border
                border-gray-200
                bg-white
                px-2
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  items-center
                "
              >
                <button
                  onClick={() =>
                    scrollToSection(
                      "details"
                    )
                  }
                  className="
                    border-b-2
                    border-orange-500
                    px-4
                    py-3
                    text-xs
                    font-bold
                    text-[#24272b]
                  "
                >
                  Asset Details
                </button>

                <button
                  onClick={() =>
                    scrollToSection(
                      "description"
                    )
                  }
                  className="
                    px-4
                    py-3
                    text-xs
                    font-medium
                    text-gray-500
                    hover:text-orange-600
                  "
                >
                  Description
                </button>

                <button
                  onClick={() =>
                    scrollToSection(
                      "inspection"
                    )
                  }
                  className="
                    px-4
                    py-3
                    text-xs
                    font-medium
                    text-gray-500
                    hover:text-orange-600
                  "
                >
                  Inspection
                </button>

                <button
                  onClick={() =>
                    scrollToSection(
                      "terms"
                    )
                  }
                  className="
                    px-4
                    py-3
                    text-xs
                    font-medium
                    text-gray-500
                    hover:text-orange-600
                  "
                >
                  Auction Terms
                </button>

                <button
                  onClick={() =>
                    scrollToSection(
                      "payment"
                    )
                  }
                  className="
                    px-4
                    py-3
                    text-xs
                    font-medium
                    text-gray-500
                    hover:text-orange-600
                  "
                >
                  Payment Terms
                </button>

                <button
                  onClick={() =>
                    scrollToSection(
                      "bid-history"
                    )
                  }
                  className="
                    px-4
                    py-3
                    text-xs
                    font-medium
                    text-gray-500
                    hover:text-orange-600
                  "
                >
                  Bid History
                </button>
              </div>
            </nav>

            {/* DETAILS */}

            <section
              id="details"
              className="
    mt-4
    scroll-mt-24
    rounded-xl
    border
    border-gray-200
    bg-white
    p-5
    shadow-sm
    sm:p-6
  "
            >
              <h2
                className="
      text-base
      font-extrabold
      text-[#24272b]
    "
              >
                {getDetailsTitle(listing)}
              </h2>

              <div
                className="
      mt-5
      grid
      gap-x-8
      gap-y-3
      sm:grid-cols-2
    "
              >
                {getListingDetails(listing).map(
                  (detail) => (
                    <DetailRow
                      key={detail.label}
                      label={detail.label}
                      value={detail.value}
                    />
                  )
                )}
              </div>
            </section>

            {/* DESCRIPTION */}

            <section
              id="description"
              className="
                mt-4
                scroll-mt-24
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >
              <h2
                className="
                  text-base
                  font-extrabold
                  text-[#24272b]
                "
              >
                Description
              </h2>

              <p
                className="
                  mt-4
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-gray-600
                "
              >
                {listing?.description ||
                  "No description provided."}
              </p>
            </section>

            {/* INSPECTION */}

            <section
              id="inspection"
              className="
                mt-4
                scroll-mt-24
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >
              <h2
                className="
                  text-base
                  font-extrabold
                  text-[#24272b]
                "
              >
                Inspection Details
              </h2>

              <div
                className="
                  mt-5
                  grid
                  gap-x-8
                  gap-y-3
                  sm:grid-cols-2
                "
              >
                <DetailRow
                  label="Inspection State"
                  value={
                    auction
                      ?.inspectionState
                  }
                />

                <DetailRow
                  label="Inspection City"
                  value={
                    auction
                      ?.inspectionCity
                  }
                />

                <DetailRow
                  label="Address"
                  value={
                    auction
                      ?.inspectionAddress
                  }
                />

                <DetailRow
                  label="Inspection Date"
                  value={
                    auction
                      ?.inspectionDate
                      ? new Date(
                        auction
                          .inspectionDate
                      ).toLocaleString()
                      : undefined
                  }
                />
              </div>
            </section>

            {/* AUCTION TERMS */}

            <section
              id="terms"
              className="
                mt-4
                scroll-mt-24
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >
              <h2
                className="
                  text-base
                  font-extrabold
                  text-[#24272b]
                "
              >
                Auction Terms
              </h2>

              <p
                className="
                  mt-4
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-gray-600
                "
              >
                {auction?.terms ||
                  "No auction terms provided."}
              </p>
            </section>

            {/* PAYMENT TERMS */}

            <section
              id="payment"
              className="
                mt-4
                scroll-mt-24
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >
              <h2
                className="
                  text-base
                  font-extrabold
                  text-[#24272b]
                "
              >
                Payment Terms
              </h2>

              <p
                className="
                  mt-4
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-gray-600
                "
              >
                {auction?.paymentTerms ||
                  "No payment terms provided."}
              </p>
            </section>

            {/* BID HISTORY */}

            <div
              id="bid-history"
              className="
                mt-4
              "
            >
              <BidHistory
                bids={
                  auction?.bids || []
                }
              />
            </div>

            {/* TABLET + MOBILE AUCTION CARDS */}

            {/* <div
              className="
                mt-5
                space-y-4
                lg:hidden
              "
            >
             

              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                <AuctionSummaryCard
                  auction={auction}
                />

                <BidCard
                  bidAmount={
                    bidAmount
                  }
                  setBidAmount={
                    setBidAmount
                  }
                  minimumBid={
                    minimumBid
                  }
                  canBid={
                    canBid
                  }
                  bidLoading={
                    bidLoading
                  }
                  handleBid={
                    handleBid
                  }
                />
              </div>

              {/* Seller below on tablet */}

            {/* <SellerCard
                seller={
                  listing?.seller
                }
              />

              <AuctionInfoCard
                auction={auction}
              />
            </div> */}

            {/* TABLET + MOBILE AUCTION AREA */}

            <div
              className="
    mt-5
    lg:hidden
  "
            >
              {/* SUMMARY + BID */}

              <div
                className="
      grid
      items-stretch
      gap-4
      md:grid-cols-2
    "
              >
                <AuctionSummaryCard
                  auction={auction}
                />

                <BidCard
                  bidAmount={bidAmount}
                  setBidAmount={setBidAmount}
                  minimumBid={minimumBid}
                  canBid={canBid}
                  bidLoading={bidLoading}
                  handleBid={handleBid}
                />
              </div>

              {/* SELLER */}

              <div
                className="
      mt-4
    "
              >
                <SellerCard
                  seller={listing?.seller}
                />
              </div>

              {/* AUCTION INFORMATION */}

              <div
                className="
      mt-4
    "
              >
                <AuctionInfoCard
                  auction={auction}
                />
              </div>
            </div>
          </div>

          {/* DESKTOP RIGHT SIDEBAR */}

          <aside
            className="
              hidden
              lg:block
            "
          >
            <div
              className="
                sticky
                top-24
                space-y-4
              "
            >
              <div
                className="
                  rounded-2xl
                  bg-[#24272b]
                  p-5
                  shadow-sm
                "
              >
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <span
                    className="
                      rounded-full
                      bg-green-500/15
                      px-2.5
                      py-1
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-wide
                      text-green-400
                    "
                  >
                    {isEnded
                      ? "Ended"
                      : isUpcoming
                        ? "Upcoming"
                        : "Live"}
                  </span>
                </div>

                <h1
                  className="
                    text-xl
                    font-extrabold
                    leading-tight
                    text-white
                  "
                >
                  {listing?.title}
                </h1>

                <div
                  className="
                    mt-5
                  "
                >
                  <AuctionCountdown
                    startDate={
                      auction.startDate
                    }
                    endDate={
                      auction.endDate
                    }
                  />
                </div>
              </div>

              <AuctionSummaryCard
                auction={auction}
              />

              <BidCard
                bidAmount={
                  bidAmount
                }
                setBidAmount={
                  setBidAmount
                }
                minimumBid={
                  minimumBid
                }
                canBid={
                  canBid
                }
                bidLoading={
                  bidLoading
                }
                handleBid={
                  handleBid
                }
              />

              <SellerCard
                seller={
                  listing?.seller
                }
              />

              <AuctionInfoCard
                auction={auction}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE STICKY BID BAR */}

      {canBid && (
        <div
          className="
      fixed
      inset-x-0
      bottom-0
      z-40
      border-t
      border-gray-200
      bg-white/95
      px-4
      py-3
      shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
      backdrop-blur
      lg:hidden
    "
        >
          <div
            className="
        mx-auto
        flex
        max-w-7xl
        items-center
        gap-3
      "
          >
            <div
              className="
          min-w-0
          flex-1
        "
            >
              <p
                className="
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            text-gray-400
          "
              >
                Current Bid
              </p>

              <p
                className="
            truncate
            text-lg
            font-extrabold
            text-[#24272b]
          "
              >
                ₦
                {Number(
                  auction.currentBid || 0
                ).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() =>
                scrollToSection(
                  "place-bid"
                )
              }
              className="
          rounded-xl
          bg-[#ff8a00]
          px-5
          py-3
          text-xs
          font-extrabold
          text-white
          shadow-sm
          transition
          hover:bg-[#e97d00]
          active:scale-[0.98]
        "
            >
              Place Bid
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: any;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        border-b
        border-gray-100
        py-2
      "
    >
      <span
        className="
          text-[11px]
          text-gray-500
        "
      >
        {label}
      </span>

      <span
        className="
          text-right
          text-[11px]
          font-bold
          text-[#24272b]
        "
      >
        {value ??
          "Not provided"}
      </span>
    </div>
  );
}

function AuctionSummaryCard({
  auction,
}: {
  auction: any;
}) {
  return (
    <section
      className="
        flex
        h-full
        flex-col
        rounded-xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <AuctionStatusCard
        auction={auction}
      />

      <div
        className="
          mt-5
        "
      >
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            text-gray-400
          "
        >
          Current Bid
        </p>

        <h2
          className="
            mt-1
            text-2xl
            font-extrabold
            tracking-tight
            text-[#24272b]
          "
        >
          ₦
          {Number(
            auction.currentBid || 0
          ).toLocaleString()}
        </h2>
      </div>

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-3
        "
      >
        <StatBox
          label="Starting Bid"
          value={`₦${Number(
            auction.startingBid || 0
          ).toLocaleString()}`}
        />

        <StatBox
          label="Minimum Increment"
          value={`₦${Number(
            auction.minimumIncrement || 0
          ).toLocaleString()}`}
        />

        <StatBox
          label="Total Bids"
          value={
            auction?.bids
              ?.length || 0
          }
        />

        <StatBox
          label="Highest Bidder"
          value={
            auction?.bids?.[0]
              ?.user?.name ||
            "No bids yet"
          }
        />
      </div>
    </section>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div
      className="
        rounded-lg
        bg-gray-50
        p-3
      "
    >
      <p
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-wide
          text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          truncate
          text-xs
          font-extrabold
          text-[#24272b]
        "
      >
        {value}
      </p>
    </div>
  );
}

function BidCard({
  bidAmount,
  setBidAmount,
  minimumBid,
  canBid,
  bidLoading,
  handleBid,
}: {
  bidAmount: string;

  setBidAmount: (
    value: string
  ) => void;

  minimumBid: number;

  canBid: boolean;

  bidLoading: boolean;

  handleBid: () => void;
}) {
  return (
    <section
      id="place-bid"
      className="
      scroll-mt-24
      rounded-xl
      border
      border-gray-200
      bg-white
      p-5
      shadow-sm
    "
    >
      <div>
        <h2
          className="
            text-sm
            font-extrabold
            text-[#24272b]
          "
        >
          Place Your Bid
        </h2>

        <p
          className="
            mt-1
            text-[10px]
            text-gray-500
          "
        >
          Minimum bid:
          {" "}
          <span
            className="
              font-bold
              text-[#24272b]
            "
          >
            ₦
            {minimumBid.toLocaleString()}
          </span>
        </p>
      </div>

      <div
        className="
          mt-5
        "
      >
        <label
          className="
            mb-1.5
            block
            text-[10px]
            font-semibold
            text-gray-500
          "
        >
          Your Bid Amount
        </label>

        <input
          type="number"
          value={bidAmount}
          min={minimumBid}
          disabled={!canBid}
          onChange={(e) =>
            setBidAmount(
              e.target.value
            )
          }
          placeholder={
            minimumBid.toString()
          }
          className="
            w-full
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            font-bold
            text-[#24272b]
            outline-none
            transition
            placeholder:text-gray-300
            focus:border-orange-400
            focus:ring-2
            focus:ring-orange-100
            disabled:cursor-not-allowed
            disabled:bg-gray-100
          "
        />
      </div>

      <button
        onClick={handleBid}
        disabled={
          !canBid ||
          bidLoading
        }
        className="
          mt-4
          w-full
          rounded-lg
          bg-[#ff8a00]
          px-4
          py-3
          text-xs
          font-extrabold
          text-white
          transition
          hover:bg-[#e97d00]
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:bg-gray-300
        "
      >
        {bidLoading
          ? "Placing Bid..."
          : !canBid
            ? "Bidding Unavailable"
            : `Place Bid — ₦${(
              Number(
                bidAmount
              ) ||
              minimumBid
            ).toLocaleString()}`}
      </button>

      <p
        className="
          mt-auto
          pt-3
          text-center
          text-[9px]
          leading-4
          text-gray-400
        "
      >
        By bidding, you agree
        to the auction terms.
      </p>
    </section>
  );
}

function SellerCard({
  seller,
}: {
  seller: any;
}) {
  const sellerName =
    seller?.name ||
    seller?.companyName ||
    "Marketplace Seller";

  const sellerId =
    seller?.id ||
    seller?.userId;

  const sellerInitial =
    String(
      sellerName
    )
      .charAt(0)
      .toUpperCase();

  return (
    <section
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            text-gray-400
          "
        >
          Seller
        </p>

        {sellerId && (
          <a
            href={`/sellers/${sellerId}`}
            className="
              text-[10px]
              font-bold
              text-orange-600
              transition
              hover:text-orange-700
              hover:underline
            "
          >
            View Profile
          </a>
        )}
      </div>

      <div
        className="
          mt-4
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-orange-50
            text-sm
            font-extrabold
            text-orange-600
          "
        >
          {sellerInitial}
        </div>

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <p
              className="
                truncate
                text-sm
                font-extrabold
                text-[#24272b]
              "
            >
              {sellerName}
            </p>

            {seller?.isApproved && (
              <span
                className="
                  rounded-full
                  bg-green-50
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  text-green-700
                "
              >
                Verified
              </span>
            )}
          </div>

          <p
            className="
              mt-1
              text-[10px]
              text-gray-500
            "
          >
            {seller?.companyName ||
              "Marketplace Seller"}
          </p>
        </div>
      </div>

      {sellerId && (
        <a
          href={`/sellers/${sellerId}`}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            rounded-lg
            border
            border-orange-200
            bg-orange-50
            px-4
            py-2.5
            text-xs
            font-extrabold
            text-orange-600
            transition
            hover:border-orange-300
            hover:bg-orange-100
          "
        >
          View Seller Profile
        </a>
      )}
    </section>
  );
}

function AuctionInfoCard({
  auction,
}: {
  auction: any;
}) {
  return (
    <section
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          space-y-3
          text-[10px]
          text-gray-500
        "
      >
        <div
          className="
            flex
            justify-between
            gap-4
          "
        >
          <span>
            Starts
          </span>

          <span
            className="
              text-right
              font-semibold
              text-[#24272b]
            "
          >
            {new Date(
              auction.startDate
            ).toLocaleString()}
          </span>
        </div>

        <div
          className="
            flex
            justify-between
            gap-4
          "
        >
          <span>
            Ends
          </span>

          <span
            className="
              text-right
              font-semibold
              text-[#24272b]
            "
          >
            {new Date(
              auction.endDate
            ).toLocaleString()}
          </span>
        </div>

        <button
          className="
            w-full
            border-t
            border-gray-100
            pt-3
            text-left
            font-semibold
            text-red-500
          "
        >
          Report auction
        </button>
      </div>
    </section>
  );
}

function getDetailsTitle(
  listing: any
) {
  if (
    listing?.equipmentDetails
  ) {
    return "Equipment Details";
  }

  if (
    listing?.propertyDetails
  ) {
    return "Property Details";
  }

  if (
    listing?.quarryDetails
  ) {
    return "Quarry Details";
  }

  if (
    listing?.sparePartDetails
  ) {
    return "Spare Part Details";
  }

  return "Listing Details";
}

function getListingDetails(
  listing: any
): {
  label: string;
  value: any;
}[] {
  const equipment =
    listing?.equipmentDetails;

  if (equipment) {
    return [
      {
        label: "Brand",
        value:
          equipment.manufacturer,
      },
      {
        label: "Model",
        value:
          equipment.model,
      },
      {
        label: "Year",
        value:
          equipment.year,
      },
      {
        label:
          "Operating Hours",
        value:
          equipment.hoursWorked
            ? `${equipment.hoursWorked} hrs`
            : undefined,
      },
      {
        label:
          "Overall Condition",
        value:
          equipment.overallCondition,
      },
      {
        label:
          "Mechanical Condition",
        value:
          equipment.mechanicalCondition,
      },
      {
        label:
          "Hydraulic Condition",
        value:
          equipment.hydraulicCondition,
      },
      {
        label:
          "Max Lifting Capacity",
        value:
          equipment.liftingCapacity,
      },
      {
        label:
          "Serial Number",
        value:
          equipment.serialNumber,
      },
      {
        label: "State",
        value:
          listing?.state,
      },
    ];
  }

  const property =
    listing?.propertyDetails;

  if (property) {
    return [
      {
        label:
          "Property Type",
        value:
          property.propertyType,
      },
      {
        label: "State",
        value:
          property.state ||
          listing?.state,
      },
      {
        label: "City",
        value:
          property.city ||
          listing?.city,
      },
      {
        label:
          "Plot Size",
        value:
          property.plotSize
            ? `${property.plotSize} ${property.plotUnit ||
            ""
            }`
            : undefined,
      },
      {
        label:
          "Factory Size",
        value:
          property.factorySize,
      },
      {
        label:
          "Warehouse Size",
        value:
          property.warehouseSize,
      },
      {
        label:
          "Office Space",
        value:
          property.officeSpace
            ? "Available"
            : "Not available",
      },
      {
        label: "Floors",
        value:
          property.floors,
      },
      {
        label:
          "Parking Spaces",
        value:
          property.parkingSpaces,
      },
      {
        label:
          "Power Supply",
        value:
          property.powerSupply,
      },
      {
        label:
          "Road Access",
        value:
          property.roadAccess
            ? "Available"
            : "Not available",
      },
      {
        label:
          "Title Document",
        value:
          property.titleDocument,
      },
    ];
  }

  const quarry =
    listing?.quarryDetails;

  if (quarry) {
    return [
      {
        label:
          "Quarry Type",
        value:
          quarry.quarryType,
      },
      {
        label:
          "Reserve Estimate",
        value:
          quarry.reserveEstimate,
      },
      {
        label:
          "Production Capacity",
        value:
          quarry.productionCapacity,
      },
      {
        label:
          "Mining License",
        value:
          quarry.miningLicense,
      },
      {
        label: "State",
        value:
          quarry.state ||
          listing?.state,
      },
      {
        label: "City",
        value:
          quarry.city ||
          listing?.city,
      },
    ];
  }

  const sparePart =
    listing?.sparePartDetails;

  if (sparePart) {
    return [
      {
        label:
          "Part Name",
        value:
          sparePart.partName,
      },
      {
        label:
          "Manufacturer",
        value:
          sparePart.manufacturer,
      },
      {
        label:
          "Part Number",
        value:
          sparePart.partNumber,
      },
      {
        label:
          "Condition",
        value:
          sparePart.condition,
      },
      {
        label:
          "Compatible Model",
        value:
          sparePart.compatibleModel,
      },
    ];
  }

  return [
    {
      label: "Category",
      value:
        listing?.category?.name,
    },
    {
      label: "State",
      value:
        listing?.state,
    },
    {
      label: "City",
      value:
        listing?.city,
    },
  ];
}
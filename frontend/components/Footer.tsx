import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16">

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* BRAND */}

          <div className="lg:col-span-2">

            <Link
              href="/"
              className="text-3xl font-bold text-white"
            >
              Rose<span className="text-orange-500">
                bod
              </span>
            </Link>

            <p className="max-w-md text-slate-400 mt-5 leading-7">
              Nigeria&apos;s industrial marketplace
              for heavy equipment, properties,
              quarry opportunities, spare parts
              and live auctions.
            </p>

            <div className="flex gap-3 mt-6">

              <span className="border border-slate-700 rounded-lg px-3 py-2 text-sm">
                🇳🇬 Nigeria
              </span>

              <span className="border border-slate-700 rounded-lg px-3 py-2 text-sm">
                Industrial Marketplace
              </span>

            </div>

          </div>


          {/* MARKETPLACE */}

          <div>

            <h3 className="font-bold text-white">
              Marketplace
            </h3>

            <div className="flex flex-col gap-3 mt-5">

              <Link
                href="/equipment"
                className="hover:text-orange-400"
              >
                Equipment
              </Link>

              <Link
                href="/properties"
                className="hover:text-orange-400"
              >
                Properties
              </Link>

              <Link
                href="/quarry"
                className="hover:text-orange-400"
              >
                Quarry
              </Link>

              <Link
                href="/spare-parts"
                className="hover:text-orange-400"
              >
                Spare Parts
              </Link>

              <Link
                href="/auctions"
                className="hover:text-orange-400"
              >
                Live Auctions
              </Link>

            </div>

          </div>


          {/* SELL */}

          <div>

            <h3 className="font-bold text-white">
              Sell on Rosebod
            </h3>

            <div className="flex flex-col gap-3 mt-5">

              <Link
                href="/create-listing"
                className="hover:text-orange-400"
              >
                Create Listing
              </Link>

              <Link
                href="/dashboard/my-listings"
                className="hover:text-orange-400"
              >
                My Listings
              </Link>

              <Link
                href="/dashboard"
                className="hover:text-orange-400"
              >
                Seller Dashboard
              </Link>

              <Link
                href="/register"
                className="hover:text-orange-400"
              >
                Become a Seller
              </Link>

            </div>

          </div>


          {/* SUPPORT */}

          <div>

            <h3 className="font-bold text-white">
              Support
            </h3>

            <div className="flex flex-col gap-3 mt-5">

              <Link
                href="/about"
                className="hover:text-orange-400"
              >
                About Rosebod
              </Link>

              <Link
                href="/contact"
                className="hover:text-orange-400"
              >
                Contact Us
              </Link>

              <Link
                href="/help"
                className="hover:text-orange-400"
              >
                Help Centre
              </Link>

              <Link
                href="/terms"
                className="hover:text-orange-400"
              >
                Terms of Use
              </Link>

              <Link
                href="/privacy"
                className="hover:text-orange-400"
              >
                Privacy Policy
              </Link>

            </div>

          </div>

        </div>


        {/* BOTTOM */}

        <div className="border-t border-slate-800 mt-14 pt-7 flex flex-col md:flex-row gap-4 justify-between">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Rosebod.
            All rights reserved.
          </p>

          <p className="text-sm text-slate-500">
            Built for industrial trade across Nigeria.
          </p>

        </div>

      </div>

    </footer>
  );
}
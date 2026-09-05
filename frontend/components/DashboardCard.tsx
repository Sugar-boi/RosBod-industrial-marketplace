import Link from "next/link";

export default function DashboardCard({
  title,
  value,
  icon,
  color,
  href,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block"
    >
      <div
        className="
          
          rounded-2xl
          border
          bg-white
          p-4
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          sm:p-6
          cursor-pointer
        "
      >
        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <p className="text-xs font-medium text-gray-500 sm:text-sm">
              {title}
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#24272b] sm:text-3xl">
              {value ?? 0}
            </h2>

          </div>

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-lg
              sm:h-12
              sm:w-12
              sm:text-xl
              ${color}
            `}
          >
            {icon}
          </div>

        </div>

        <div className="mt-4">

          <span
            className="
              text-xs
              font-semibold
              text-[#d97706]
              transition-transform
              duration-300
              group-hover:translate-x-1
              sm:text-sm
            "
          >
            View →
          </span>

        </div>

      </div>
    </Link>
  );
}
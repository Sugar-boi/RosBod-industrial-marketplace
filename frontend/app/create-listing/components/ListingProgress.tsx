type Step = {
  number: number;
  label: string;
};

type ListingProgressProps = {
  steps: Step[];
  currentStep: number;
};

export default function ListingProgress({
  steps,
  currentStep,
}: ListingProgressProps) {
  return (
    <section
      className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
              sm:p-5
          "
    >
      <div
        className="
                  mb-4
                  flex
                  items-center
                  justify-between
              "
      >
        <div>
          <p
            className="
                          text-xs
                          font-extrabold
                          uppercase
                          tracking-wide
                          text-orange-600
                      "
          >
            Create Listing
          </p>

          <h2
            className="
                          mt-1
                          text-base
                          font-extrabold
                          text-[#24272b]
                      "
          >
            Step {currentStep} of {steps.length}
          </h2>
        </div>

        <span
          className="
                      rounded-full
                      bg-orange-50
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      text-orange-600
                  "
        >
          {Math.round(
            (currentStep / steps.length) * 100
          )}% complete
        </span>
      </div>

      <div
        className="
                  flex
                  items-start
                  justify-between
                  gap-1
              "
      >
        {steps.map(
          (step, index) => {
            const isComplete =
              step.number < currentStep;

            const isActive =
              step.number === currentStep;

            return (
              <div
                key={step.number}
                className="
                                  flex
                                  min-w-0
                                  flex-1
                                  items-start
                              "
              >
                <div
                  className="
                                      flex
                                      min-w-0
                                      flex-1
                                      flex-col
                                      items-center
                                  "
                >
                  <div
                    className={`
                                          flex
                                          h-7
                                          w-7
                                          shrink-0
                                          items-center
                                          justify-center
                                          rounded-full
                                          text-[10px]
                                          font-extrabold
                                          ${isComplete
                        ? "bg-green-600 text-white"
                        : isActive
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }
                                      `}
                  >
                    {isComplete
                      ? "✓"
                      : step.number}
                  </div>

                  <span
                    className={`
                                          mt-2
                                          hidden
                                          text-center
                                          text-[9px]
                                          font-semibold
                                          sm:block
                                          ${isActive
                        ? "text-orange-600"
                        : isComplete
                          ? "text-green-700"
                          : "text-gray-400"
                      }
                                      `}
                  >
                    {step.label}
                  </span>
                </div>

                {index <
                  steps.length - 1 && (
                    <div
                      className={`
                                          mt-3
                                          h-[2px]
                                          flex-1
                                          ${step.number <
                          currentStep
                          ? "bg-green-500"
                          : "bg-gray-200"
                        }
                                      `}
                    />
                  )}
              </div>
            );
          }
        )}
      </div>

      <p
        className="
                  mt-3
                  text-center
                  text-[10px]
                  font-medium
                  text-gray-500
                  sm:hidden
              "
      >
        {
          steps[
            currentStep - 1
          ]?.label
        }
      </p>
    </section>
  );
}
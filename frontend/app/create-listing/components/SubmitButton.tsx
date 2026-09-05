type Props = {
  loading: boolean;
  disabled?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;

  type?: "button" | "submit";

  form?: string;
};

export default function SubmitButton({
  loading,
  disabled = false,
  onClick,
  type = "submit",
  form,
}: Props) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
              w-full
              rounded-xl
              py-3
              font-bold
              text-white
              ${loading
          ? "cursor-pointer bg-gray-500"
          : "bg-orange-600 hover:bg-orange-700"
        }
          `}
    >
      {loading
        ? "Creating Listing..."
        : "Create Listing"}
    </button>
  );
}


// type Props = {
//   loading: boolean;

//   onClick?: (
//     e: React.MouseEvent<HTMLButtonElement>
//   ) => void;

//   type?: "button" | "submit";

//   form?: string;
// };

// export default function SubmitButton({
//   loading,
//   onClick,
//   type = "submit",
//   form,
// }: Props) {
//   return (
//     <button
//       type={type}
//       form={form}
//       onClick={onClick}
//       disabled={loading}
//       className={`
//         w-full
//         rounded-xl
//         py-3
//         font-bold
//         text-white
//         ${
//           loading
//             ? "cursor-pointer bg-gray-500"
//             : "bg-orange-600 hover:bg-orange-700"
//         }
//       `}
//     >
//       {loading
//         ? "Creating Listing..."
//         : "Create Listing"}
//     </button>
//   );
// }
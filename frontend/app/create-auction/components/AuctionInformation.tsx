type Props = {
  title: string;
  setTitle: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  categoryId: string;
  setCategoryId: (value: string) => void;

  categories: any[];
};

export default function AuctionInformation({
  title,
  setTitle,
  description,
  setDescription,
  categoryId,
  setCategoryId,
  categories,
}: Props) {

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-5">

      <h2 className="text-2xl font-bold">
        Auction Information
      </h2>

      <input
        type="text"
        placeholder="Auction Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        className="border rounded-lg p-3 w-full"
      />

      <textarea
        rows={5}
        placeholder="Describe the asset..."
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        className="border rounded-lg p-3 w-full"
      />

      <select
        value={categoryId}
        onChange={(e) =>
          setCategoryId(e.target.value)
        }
        className="border rounded-lg p-3 w-full"
      >
        <option value="">
          Select Category
        </option>

        {categories.map((cat: any) => (
          <option
            key={cat.id}
            value={cat.id}
          >
            {cat.name}
          </option>
        ))}

      </select>

    </div>
  );
}
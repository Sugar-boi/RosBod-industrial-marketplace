type Props = {
  partName: string;
  setPartName: (v: string) => void;

  brand: string;
  setBrand: (v: string) => void;

  customBrand: string;
  setCustomBrand: (v: string) => void;

  model: string;
  setModel: (v: string) => void;

  partNumber: string;
  setPartNumber: (v: string) => void;

  quantity: string;
  setQuantity: (v: string) => void;

  condition: string;
  setCondition: (v: string) => void;

  state: string;
  setState: (v: string) => void;

  city: string;
  setCity: (v: string) => void;
};

export default function SparePartForm({
  partName,
  setPartName,
  brand,
  setBrand,
  customBrand,
  setCustomBrand,
  model,
  setModel,
  partNumber,
  setPartNumber,
  quantity,
  setQuantity,
  condition,
  setCondition,
  state,
  setState,
  city,
  setCity,
}: Props) {
  return (
      <div className="space-y-4">

          <h2 className="text-xl font-bold">
              Spare Part Information
          </h2>

          <input
              placeholder="Part Name"
              value={partName}
              onChange={(e)=>setPartName(e.target.value)}
              className="border p-2 w-full rounded"
          />

          <input
              placeholder="Brand"
              value={brand}
              onChange={(e)=>setBrand(e.target.value)}
              className="border p-2 w-full rounded"
          />

          <input
              placeholder="Model"
              value={model}
              onChange={(e)=>setModel(e.target.value)}
              className="border p-2 w-full rounded"
          />

          <input
              placeholder="Part Number"
              value={partNumber}
              onChange={(e)=>setPartNumber(e.target.value)}
              className="border p-2 w-full rounded"
          />

          <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e)=>setQuantity(e.target.value)}
              className="border p-2 w-full rounded"
          />

          <select
              value={condition}
              onChange={(e)=>setCondition(e.target.value)}
              className="border p-2 w-full rounded"
          >
              <option value="">Condition</option>
              <option>New</option>
              <option>Used</option>
              <option>Refurbished</option>
          </select>

          <input
              placeholder="State"
              value={state}
              onChange={(e)=>setState(e.target.value)}
              className="border p-2 w-full rounded"
          />

          <input
              placeholder="City"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              className="border p-2 w-full rounded"
          />

      </div>
  );
}
// "use client";

// interface Props {
//     categories: any[];

//     parentCategoryId: string;
//     setParentCategoryId: (value: string) => void;

//     categoryId: string;
//     setCategoryId: (value: string) => void;
// }

// export default function CategorySelector({
//     categories,
//     parentCategoryId,
//     setParentCategoryId,
//     categoryId,
//     setCategoryId,
// }: Props) {

//     const parentCategories = categories.filter(
//         (c) => c.parentId === null
//     );

//     const subCategories = categories.filter(
//         (c) => c.parentId === Number(parentCategoryId)
//     );

//     const safeSubCategories =
//         Number(parentCategoryId)
//             ? subCategories
//             : [];

//     return (
//         <div className="grid gap-4 md:grid-cols-2">


//             <select
//                 value={parentCategoryId}
//                 onChange={(e) => {
//                     setParentCategoryId(e.target.value);
//                     setCategoryId("");
//                 }}
//                 className="
//                 w-full
//                 rounded-lg
//                 border
//                 border-gray-300
//                 px-3
//                 py-2.5
//                 text-sm
//                 outline-none
//                 transition
//                 focus:border-orange-500
//                 focus:ring-2
//                 focus:ring-orange-100
//             "
//             >
//                 <option value="">
//                     Select Main Category
//                 </option>

//                 {parentCategories.map((c) => (
//                     <option key={c.id} value={c.id}>
//                         {c.name}
//                     </option>
//                 ))}
//             </select>

//             {parentCategoryId && (
//                 <select
//                     value={categoryId}
//                     onChange={(e) => setCategoryId(e.target.value)}
//                     className="
//                     w-full
//                     rounded-lg
//                     border
//                     border-gray-300
//                     px-3
//                     py-2.5
//                     text-sm
//                     outline-none
//                     transition
//                     focus:border-orange-500
//                     focus:ring-2
//                     focus:ring-orange-100
//                 "
//                 >
//                     <option value="">
//                         Select Sub Category
//                     </option>

//                     {subCategories.map((c) => (
//                         <option key={c.id} value={c.id}>
//                             {c.name}
//                         </option>
//                     ))}
//                 </select>
//             )}

//         </div>
//     );
// }
"use client";

type Category = {
    id: number;
    name: string;
    parentId: number | null;
};

type CategorySelectorProps = {
    categories: Category[];
    parentCategoryId: string;
    setParentCategoryId: (value: string) => void;
    categoryId: string;
    setCategoryId: (value: string) => void;
};

const selectClassName = `
    w-full
    rounded-lg
    border
    border-gray-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-gray-900
    outline-none
    transition
    focus:border-orange-500
    focus:ring-2
    focus:ring-orange-100
    disabled:cursor-not-allowed
    disabled:bg-gray-50
    disabled:text-gray-400
`;

export default function CategorySelector({
    categories,
    parentCategoryId,
    setParentCategoryId,
    categoryId,
    setCategoryId,
}: CategorySelectorProps) {
    const parentCategories = categories.filter(
        (category) => category.parentId === null
    );

    const subCategories = categories.filter(
        (category) =>
            category.parentId === Number(parentCategoryId)
    );

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Main Category
                </label>

                <select
                    value={parentCategoryId}
                    onChange={(e) => {
                        setParentCategoryId(e.target.value);
                        setCategoryId("");
                    }}
                    className={selectClassName}
                    required
                >
                    <option value="">
                        Select main category
                    </option>

                    {parentCategories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Subcategory
                </label>

                <select
                    value={categoryId}
                    onChange={(e) =>
                        setCategoryId(e.target.value)
                    }
                    disabled={!parentCategoryId}
                    className={selectClassName}
                    required
                >
                    <option value="">
                        {parentCategoryId
                            ? "Select subcategory"
                            : "Select a main category first"}
                    </option>

                    {subCategories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    return (
        <div>
            <h4 className="text-md font-semibold mb-2"> ราคาต่อคืนสูงสุด</h4>
            <select
                className="p-2 border rounded-md w-full text-sm"
                value={selectedPrice}
                onChange={(event) =>
                    onChange(
                        event.target.value ? parseInt(event.target.value) : undefined
                    )
                }
            >
                <option value="">ระบุราคาต่อคืนสูงสุด</option>
                {[50, 100, 300, 500, 1000].map((price, index) => (
                    <option key={index} value={price}>{price}</option>
                ))}
            </select>
        </div>
    );
};

export default PriceFilter;
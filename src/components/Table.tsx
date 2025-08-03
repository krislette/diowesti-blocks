interface TableProps {
  headers: string[];
  data: Record<string, any>[];
  onRowClick?: (row: Record<string, any>) => void;
}

function Table({ headers, data, onRowClick }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-dost-white">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-r border-gray-200 font-bold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-dost-white">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 text-sm text-gray-900 border-r border-gray-200"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

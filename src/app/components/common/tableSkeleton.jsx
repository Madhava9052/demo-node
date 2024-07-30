export default function TableSkeleton({ rows, columns }) {
  return [...Array(rows)].map((_, index) => (
    <tr key={index} className="animate-pulse">
      {[...Array(columns)].map((_, index1) => (
        <td key={index1}>
          <div className="h-10 bg-gray-500 w-full"></div>
        </td>
      ))}
    </tr>
  ));
}

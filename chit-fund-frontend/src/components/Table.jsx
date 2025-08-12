import React from 'react';

function Table({ headers, rows }) {
  return (
    <table className="min-w-full text-left border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((head, i) => (
            <th key={i} className="py-2 px-4">{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="even:bg-gray-50">
            {row.map((cell, j) => (
              <td key={j} className="py-2 px-4">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;

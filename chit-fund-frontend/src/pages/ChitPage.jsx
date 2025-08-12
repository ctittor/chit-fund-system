import React from "react";
import useChits from "../hooks/useChits";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

function ChitPage() {
  const { chits, loading, error } = useChits();

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Chit Schemes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chits.length === 0 && (
          <p className="text-gray-500">No chit schemes found.</p>
        )}
        {chits.map((chit) => (
          <Card key={chit.id}>
            <h3 className="text-lg font-semibold mb-1">{chit.name}</h3>
            <p className="mb-1">
              <span className="text-gray-600">Value:</span> ₹{chit.chitValue}
            </p>
            <p>
              <span className="text-gray-600">Duration:</span> {chit.duration} months
            </p>
            <p>
              <span className="text-gray-600">Installment:</span> ₹{chit.installment}
            </p>
            {/* Future: Add subscribe/join button here */}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ChitPage;

import React from "react";
import useCustomers from "../hooks/useCustomers";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

function CustomerPage() {
  const { customers, loading, error } = useCustomers();

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Customers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.length === 0 && (
          <p className="text-gray-500">No customers found.</p>
        )}
        {customers.map((customer) => (
          <Card key={customer.id}>
            <h3 className="text-lg font-semibold mb-1">{customer.name}</h3>
            <p className="text-gray-700 mb-1">{customer.email}</p>
            <p className="text-gray-500">{customer.phone}</p>
            {/* You can add actions, view buttons, etc., here */}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CustomerPage;

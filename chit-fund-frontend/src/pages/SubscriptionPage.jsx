import React from "react";
import useSubscriptions from "../hooks/useSubscriptions";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

function SubscriptionPage() {
  const { subscriptions, loading, error } = useSubscriptions();

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Subscriptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.length === 0 && (
          <p className="text-gray-500">No subscriptions found.</p>
        )}
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <h3 className="text-lg font-semibold mb-1">
              {sub.customer?.name || "Customer"} — {sub.chit?.name || "Chit"}
            </h3>
            <p><span className="text-gray-600">Start Date:</span> {sub.startDate?.slice(0, 10)}</p>
            <p><span className="text-gray-600">Status:</span> {sub.status}</p>
            {/* Future: Add actions like Cancel/Manage Subscription */}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionPage;

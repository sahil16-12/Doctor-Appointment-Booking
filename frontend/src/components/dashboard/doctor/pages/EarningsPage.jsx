import { useState, useEffect } from "react";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import { paymentAPI } from "../../../../services/api";
import toast from "react-hot-toast";

const EarningsPage = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await paymentAPI.getDoctorEarnings();
      setEarnings(data);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount, currency) => {
    const symbol = currency?.toLowerCase() === "inr" ? "₹" : "$";
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status, isRefunded) => {
    if (isRefunded) {
      return <Badge variant="cancelled">Refunded</Badge>;
    }

    switch (status) {
      case "SUCCEEDED":
        return <Badge variant="confirmed">Completed</Badge>;
      case "PENDING":
        return <Badge variant="pending">Pending</Badge>;
      case "FAILED":
        return <Badge variant="cancelled">Failed</Badge>;
      case "REFUNDED":
        return <Badge variant="cancelled">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Content className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {earnings
                ? formatAmount(
                    earnings.totalEarnings,
                    earnings.recentTransactions[0]?.currency || "INR",
                  )
                : "-"}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              Total Earnings
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {earnings
                ? formatAmount(
                    earnings.thisMonthEarnings,
                    earnings.recentTransactions[0]?.currency || "INR",
                  )
                : "-"}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              This Month
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {earnings?.thisMonthCompletedAppointments || 0} appointments
            </p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {earnings
                ? formatAmount(
                    earnings.pendingPayouts,
                    earnings.recentTransactions[0]?.currency || "INR",
                  )
                : "-"}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              Pending Payouts
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting transfer</p>
          </Card.Content>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <Card.Header>
          <Card.Title>Transaction History</Card.Title>
        </Card.Header>
        <Card.Content>
          {earnings?.recentTransactions &&
          earnings.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Patient</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.recentTransactions.map((transaction) => (
                    <tr
                      key={transaction.paymentId}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 text-sm">
                        {formatDate(transaction.paymentDate)}
                      </td>
                      <td className="py-3 text-sm font-medium">
                        {transaction.patientName}
                      </td>
                      <td className="py-3 text-sm font-semibold">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </td>
                      <td className="py-3">
                        {getStatusBadge(
                          transaction.status,
                          transaction.isRefunded,
                        )}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {transaction.isRefunded && transaction.refundReason ? (
                          <span className="text-red-600">
                            Refunded: {transaction.refundReason}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No transactions yet</p>
              <p className="text-sm">
                Your earnings will appear here once you complete appointments
              </p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default EarningsPage;

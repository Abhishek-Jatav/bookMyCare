import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerDashboard from "@/components/CustomerDashboard";
import Header from "@/components/Header";

export default function CustomerPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
    <Header />
      <CustomerDashboard />
    </ProtectedRoute>
  );
}

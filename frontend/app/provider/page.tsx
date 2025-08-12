import ProtectedRoute from "@/components/ProtectedRoute";
import ProviderDashboard from "@/components/CustomerDashboard";
import Header from  "@/components/Header";

export default function ProviderPage() {
  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <Header />
      <ProviderDashboard />
    </ProtectedRoute>
  );
}
import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { OwnerSecurityPinModal } from "./components/OwnerSecurityPinModal";
import { PaymentGatewayModal } from "./components/PaymentGatewayModal";

import { DashboardView } from "./components/views/DashboardView";
import { InteractiveMapDenahView } from "./components/views/InteractiveMapDenahView";
import { TenantsView } from "./components/views/TenantsView";
import { HousesView } from "./components/views/HousesView";
import { RoomsView } from "./components/views/RoomsView";
import { PaymentsView } from "./components/views/PaymentsView";
import { WhatsappReminderView } from "./components/views/WhatsappReminderView";
import { FinancialsView } from "./components/views/FinancialsView";
import { ReportsView } from "./components/views/ReportsView";
import { SmartAiView } from "./components/views/SmartAiView";
import { GoogleMapsView } from "./components/views/GoogleMapsView";
import { PlnPamMeterView } from "./components/views/PlnPamMeterView";
import { InventoryView } from "./components/views/InventoryView";
import { DocumentsView } from "./components/views/DocumentsView";
import { ActivityCalendarView } from "./components/views/ActivityCalendarView";
import { SettingsBackupView } from "./components/views/SettingsBackupView";
import { CalonPenghuniView } from "./components/views/CalonPenghuniView";
import { PemilikExecutiveView } from "./components/views/PemilikExecutiveView";
import { TataTertibView } from "./components/views/TataTertibView";
import { TenantPortalView } from "./components/views/TenantPortalView";
import { FacilityMaintenanceView } from "./components/views/FacilityMaintenanceView";

const AppContent: React.FC = () => {
  const {
    activeView,
    darkMode,
    isOwnerUnlocked,
    activeRole,
    isPaymentGatewayOpen,
    closePaymentGateway,
    paymentGatewayTenantId,
    paymentGatewayDefaultAmount,
  } = useApp();

  // Public views accessible without PIN
  const isPublicView =
    activeView === "calon-penghuni" ||
    activeView === "portal-penghuni" ||
    activeView === "tata-tertib" ||
    activeRole === "Calon Penghuni";

  // Protected Views requiring Owner PIN verification
  const isOwnerProtectedView =
    !isPublicView &&
    (activeView === "pemilik-executive" ||
      activeView === "keuangan" ||
      activeView === "laporan" ||
      activeView === "pengaturan" ||
      activeRole === "Pemilik");

  const renderCurrentView = () => {
    switch (activeView) {
      case "calon-penghuni":
        return <CalonPenghuniView />;
      case "portal-penghuni":
        return <TenantPortalView />;
      case "facility-maintenance":
        return <FacilityMaintenanceView />;
      case "pemilik-executive":
        return <PemilikExecutiveView />;
      case "tata-tertib":
        return <TataTertibView />;
      case "dashboard":
        return <DashboardView />;
      case "denah":
        return <InteractiveMapDenahView />;
      case "penghuni":
        return <TenantsView />;
      case "rumah":
        return <HousesView />;
      case "kamar":
        return <RoomsView />;
      case "pembayaran":
        return <PaymentsView />;
      case "reminder":
        return <WhatsappReminderView />;
      case "keuangan":
        return <FinancialsView />;
      case "laporan":
        return <ReportsView />;
      case "ai":
        return <SmartAiView />;
      case "maps":
        return <GoogleMapsView />;
      case "meter":
        return <PlnPamMeterView />;
      case "inventaris":
        return <InventoryView />;
      case "dokumen":
        return <DocumentsView />;
      case "kalender":
        return <ActivityCalendarView />;
      case "pengaturan":
        return <SettingsBackupView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-[#07140f] text-slate-100" : "bg-[#f5eedc] text-black"} font-sans antialiased transition-colors duration-200`}>
      <Header />
      <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-65px)]">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals for Security & Payment Gateway */}
      <OwnerSecurityPinModal isOpen={isOwnerProtectedView && !isOwnerUnlocked} />
      <PaymentGatewayModal
        isOpen={isPaymentGatewayOpen}
        onClose={closePaymentGateway}
        preselectedTenantId={paymentGatewayTenantId}
        defaultAmount={paymentGatewayDefaultAmount}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

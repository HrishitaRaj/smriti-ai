import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

const CaretakerLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* this renders the selected sidebar page */}
      </main>
    </div>
  );
};

export default CaretakerLayout;

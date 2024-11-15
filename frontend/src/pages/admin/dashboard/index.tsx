import Footer from "../../../components/layouts/footer";
import Header from "../../../components/layouts/header";
import Personal from "../../../components/personal";
import QuickAccess from "../../../components/quickAccess";

const AdminDashboard = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-white-100 font-nunito">
      <Header />
      <main className="flex-1 py-8">
        <div className="flex gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickAccess />
          <Personal />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

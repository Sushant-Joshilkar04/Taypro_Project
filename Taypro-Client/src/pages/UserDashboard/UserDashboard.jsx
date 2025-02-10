import { useSelector } from "react-redux";
import SavedLayouts from "../../components/SavedLayouts";

const UserDashboard = () => {
  const userInfo = useSelector(state => state.user.userInfo)
  return (
    <div className="min-h-screen">

      <main className="flex-grow p-6 bg-light-blue-50">
        <h2 className="text-2xl font-bold text-light-blue-600">
          Welcome {userInfo.username} !
        </h2>
        {/* Dashboard content */}

      </main>

      <SavedLayouts />
    </div>
  );
};

export default UserDashboard;

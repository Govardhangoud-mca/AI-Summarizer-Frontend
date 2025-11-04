import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// --- INTERFACES ---
interface HistoryItem {
  id: number;
  username: string;
  inputText: string;
  summaryText: string;
  timestamp: string;
}

interface UserItem {
  id: number;
  username: string;
  email: string; 
  role: string;
}

// --- TIME FILTER OPTIONS ---
const timeFilterOptions = [
  { value: "DAY", label: "Last 24 Hours" },
  { value: "WEEK", label: "Last 7 Days" },
  { value: "MONTH", label: "Last 30 Days" },
  { value: "ALL", label: "All Time" },
];

// --- MAIN COMPONENT ---
const AdminDashboard: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"history" | "users">("history");
  const [timeFilter, setTimeFilter] = useState<string>("DAY"); 

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async (currentFilter: string) => {
    setLoading(true);
    if (!token) return;

    try {
      const [historyRes, usersRes] = await Promise.all([
        fetch(`http://localhost:8080/api/v1/admin/history?timeFilter=${currentFilter}`, { 
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8080/api/v1/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!historyRes.ok || !usersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const historyData = await historyRes.json();
      const usersData = await usersRes.json();

      setHistory(historyData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleTimeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setTimeFilter(newFilter);
    fetchData(newFilter); 
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!token || role !== "ADMIN") {
      navigate("/login");
      return;
    }

    fetchData(timeFilter); 
  }, [navigate, fetchData, timeFilter, token]);


  // 🔑 FIX APPLIED HERE: Navigate to root (/)
  const handleLogout = () => {
    localStorage.clear();
    alert("You have been logged out.");
    navigate("/"); // Navigate to the welcome page
  };

  const deleteUser = async (userId: number) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      alert("User deleted successfully!");
      setUsers(users.filter((u) => u.id !== userId));
      fetchData(timeFilter); 
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-teal-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-5 h-5 bg-teal-400 rounded-full animate-bounce delay-200"></div>
          <div className="w-5 h-5 bg-teal-400 rounded-full animate-bounce delay-300"></div>
          <p className="text-xl font-medium text-teal-400 ml-3">
            Loading system data...
          </p>
        </div>
      </div>
    );

// --- HELPER COMPONENTS ---
const TabButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    label: string;
  }> = ({ isActive, onClick, label }) => (
    <button
      className={`px-6 py-3 text-lg font-semibold transition-all duration-300 mx-2 rounded-lg transform hover:scale-[1.03]
        ${
          isActive
            ? "bg-teal-500 text-gray-900 shadow-lg shadow-teal-500/50"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
  
  const HistorySection: React.FC<{ 
      history: HistoryItem[], 
      timeFilter: string, 
      onTimeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
  }> = ({ history, timeFilter, onTimeFilterChange }) => (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-teal-400">
          <span className="text-white">Summary</span> History Log
        </h2>
        
        {/* 💡 Time Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <label htmlFor="timeFilter" className="text-gray-300 font-medium">
            Filter By:
          </label>
          <select
            id="timeFilter"
            value={timeFilter}
            onChange={onTimeFilterChange}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 shadow-md"
          >
            {timeFilterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {history.length === 0 ? (
        <p className="text-gray-400 py-10 text-center border border-gray-700 rounded-lg bg-gray-800">
          No summarization history found for this period.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((item) => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
  
            return (
              <div
                key={item.id}
                className="rounded-xl p-5 shadow-xl bg-gray-700 border border-gray-600 transition duration-300 hover:scale-[1.03]"
              >
                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-3">
                  <h3 className="text-lg font-semibold text-white">
                    👤 User: {item.username}
                  </h3>
                  <div className="flex text-xs font-semibold text-teal-300 space-x-1 bg-gray-600 px-3 py-1 rounded-full">
                    <span>{formattedDate}</span>
                    <span className="text-gray-400">@</span>
                    <span>{formattedTime}</span>
                  </div>
                </div>
  
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-teal-900/40 rounded-lg border border-teal-600/40">
                    <strong className="text-teal-300 block mb-1">
                      Summary Output:
                    </strong>
                    <p className="text-gray-200 line-clamp-3 leading-snug">
                      {item.summaryText}
                    </p>
                  </div>
  
                  <div className="p-3 bg-gray-600/50 rounded-lg border border-gray-600">
                    <strong className="text-gray-400 block mb-1">
                      Input Snippet:
                    </strong>
                    <p className="text-gray-300 line-clamp-2 leading-snug">
                      {item.inputText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
  const UserSection: React.FC<{
    users: UserItem[];
    deleteUser: (id: number) => void;
  }> = ({ users, deleteUser }) => (
    <div>
      <h2 className="text-2xl font-bold mb-5 text-teal-400">
        <span className="text-white">User</span> Management
      </h2>
      {users.length === 0 ? (
        <p className="text-gray-400 py-10 text-center border border-gray-700 rounded-lg bg-gray-800">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-lg">
          <table className="w-full text-gray-300">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                <th className="p-4">ID</th>
                <th className="p-4">Username</th>
                {/* ❌ REMOVED: Email Header */}
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-700 transition duration-150"
                >
                  <td className="p-4 text-sm">{user.id}</td>
                  <td className="p-4 text-sm font-medium text-teal-300">
                    {user.username}
                  </td>
                  {/* ❌ REMOVED: Email Data Cell */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-red-700 text-white"
                          : "bg-green-700 text-white"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition duration-200 transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
  return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto bg-gray-800 shadow-2xl shadow-black/50 rounded-2xl p-8">
          {/* 🔹 Header with Logout */}
          <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-3">
            <h1 className="text-3xl font-extrabold text-white">
              <span className="text-teal-400">System</span> Admin Dashboard
            </h1>
  
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-lg transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          </div>
  
          {/* 🔹 Tabs */}
          <div className="flex justify-center mb-10 p-1 bg-gray-700 rounded-xl shadow-inner shadow-black/30">
            <TabButton
              isActive={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              label="Summarization History"
            />
            <TabButton
              isActive={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              label="Manage Users"
            />
          </div>
  
          {/* 🔹 Content */}
          <div className="animate-fade-in">
            {activeTab === "history" && (
              <HistorySection 
                history={history} 
                timeFilter={timeFilter} 
                onTimeFilterChange={handleTimeFilterChange} 
              />
            )}
            {activeTab === "users" && (
              <UserSection users={users} deleteUser={deleteUser} />
            )}
          </div>
        </div>
      </div>
    );
  };
  
export default AdminDashboard;
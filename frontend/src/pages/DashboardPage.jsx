export default function DashboardPage() {
    const user = JSON.parse(localStorage.getItem("user"));
  
    return (
      <div style={{ padding: "40px", fontFamily: "Inter, Arial, sans-serif" }}>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.full_name || "User"}.</p>
      </div>
    );
  }
  
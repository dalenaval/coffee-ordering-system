import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getEmployees } from "../../api/employeeService";
import "./AdminPages.css";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  const activeCount = employees.filter((emp) => emp.is_active).length;
  const inactiveCount = employees.filter((emp) => !emp.is_active).length;

  return (
    <AdminLayout title="Employee Management">
      <section className="admin-hero-card">
        <span className="admin-hero-badge">👥 Employee Records</span>
        <h2>Employee Management</h2>
        <p>
          Manage employee details, job roles, account access, and employment
          status.
        </p>
      </section>

      <div className="admin-summary-grid">
        <div className="admin-summary-card">
          <h4>Total Employees</h4>
          <h2>{employees.length}</h2>
        </div>

        <div className="admin-summary-card">
          <h4>Active Employees</h4>
          <h2>{activeCount}</h2>
        </div>

        <div className="admin-summary-card">
          <h4>Inactive Employees</h4>
          <h2>{inactiveCount}</h2>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-page-head">
          <h2>Employee List</h2>
          <p>Current employee records and operational roles.</p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Position</th>
                <th>Employment Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.full_name}</td>
                    <td>{employee.position}</td>
                    <td>
                      <span
                        className={`badge ${
                          employee.is_active ? "completed" : "cancelled"
                        }`}
                      >
                        {employee.employment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-state-cell">
                    No employee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

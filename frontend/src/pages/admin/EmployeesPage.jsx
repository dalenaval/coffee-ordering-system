import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "../../api/employeeService";
import "./AdminPages.css";

const defaultForm = {
  full_name: "",
  email: "",
  contact_no: "",
  position: "",
  role: "staff",
  employment_status: "Active",
  is_active: true,
  create_login_account: false,
  login_email: "",
  login_password: "",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      full_name: employee.full_name || "",
      email: employee.email || "",
      contact_no: employee.contact_no || "",
      position: employee.position || "",
      role: employee.role || "staff",
      employment_status: employee.employment_status || "Active",
      is_active: employee.is_active ?? true,
      create_login_account: false,
      login_email: employee.login_email || "",
      login_password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await updateEmployee(editingId, {
          full_name: form.full_name,
          email: form.email || null,
          contact_no: form.contact_no || null,
          position: form.position,
          role: form.role,
          employment_status: form.employment_status,
          is_active: form.is_active,
        });
      } else {
        await createEmployee({
          ...form,
          email: form.email || null,
          contact_no: form.contact_no || null,
          login_email: form.login_email || null,
          login_password: form.login_password || null,
        });
      }

      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error("Failed to save employee:", error);
      alert(error?.response?.data?.detail || "Failed to save employee.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (employee) => {
    try {
      await updateEmployeeStatus(employee.id, {
        is_active: !employee.is_active,
      });
      fetchEmployees();
    } catch (error) {
      console.error("Failed to update employee status:", error);
    }
  };

  const activeCount = employees.filter((emp) => emp.is_active).length;
  const inactiveCount = employees.filter((emp) => !emp.is_active).length;
  const managerCount = employees.filter((emp) => emp.role === "manager").length;

  return (
    <AdminLayout title="Employee Management">
      <section className="admin-hero-card employee-hero">
        <div className="employee-hero-content">
          <span className="admin-hero-badge">👥 Workforce Control</span>
          <h2>Manage Your Team</h2>
          <p>
            Create employee records, assign operational roles, and maintain secure
            internal access for your workforce.
          </p>
        </div>
      </section>

      <div className="admin-summary-grid">
        <div className="admin-summary-card summary-card employees-total">
          <h4>Total Employees</h4>
          <h2>{employees.length}</h2>
        </div>

        <div className="admin-summary-card summary-card employees-active">
          <h4>Active Employees</h4>
          <h2>{activeCount}</h2>
        </div>

        <div className="admin-summary-card summary-card employees-inactive">
          <h4>Inactive Employees</h4>
          <h2>{inactiveCount}</h2>
        </div>

        <div className="admin-summary-card summary-card employees-manager">
          <h4>Managers</h4>
          <h2>{managerCount}</h2>
        </div>
      </div>

      <div className="employee-workspace-grid">
        <div className="admin-page-card employee-form-card">
          <div className="admin-page-head">
            <h2>{editingId ? "Edit Employee" : "Create Employee"}</h2>
            <p>
              Maintain employee records, assign access roles, and create optional
              login credentials.
            </p>
          </div>

          <form className="employee-form-grid" onSubmit={handleSubmit}>
            <div className="employee-form-field">
              <label>Full Name</label>
              <input
                className="settings-control"
                name="full_name"
                placeholder="Enter full name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="employee-form-field">
              <label>Employee Email</label>
              <input
                className="settings-control"
                name="email"
                type="email"
                placeholder="Enter employee email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="employee-form-field">
              <label>Contact Number</label>
              <input
                className="settings-control"
                name="contact_no"
                placeholder="Enter contact number"
                value={form.contact_no}
                onChange={handleChange}
              />
            </div>

            <div className="employee-form-field">
              <label>Position</label>
              <input
                className="settings-control"
                name="position"
                placeholder="Enter position"
                value={form.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="employee-form-field">
              <label>Role</label>
              <select
                className="settings-control"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="employee-form-field">
              <label>Employment Status</label>
              <select
                className="settings-control"
                name="employment_status"
                value={form.employment_status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Probationary">Probationary</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <label className="employee-checkbox-card">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              <div>
                <strong>Employee is active</strong>
                <p>Allows this employee to be used in active operations.</p>
              </div>
            </label>

            {!editingId && (
              <label className="employee-checkbox-card">
                <input
                  type="checkbox"
                  name="create_login_account"
                  checked={form.create_login_account}
                  onChange={handleChange}
                />
                <div>
                  <strong>Create login account</strong>
                  <p>Generate a login profile for this employee.</p>
                </div>
              </label>
            )}

            {!editingId && form.create_login_account && (
              <>
                <div className="employee-form-field">
                  <label>Login Email</label>
                  <input
                    className="settings-control"
                    name="login_email"
                    type="email"
                    placeholder="Enter login email"
                    value={form.login_email}
                    onChange={handleChange}
                    required={form.create_login_account}
                  />
                </div>

                <div className="employee-form-field">
                  <label>Login Password</label>
                  <input
                    className="settings-control"
                    name="login_password"
                    type="password"
                    placeholder="Enter login password"
                    value={form.login_password}
                    onChange={handleChange}
                    required={form.create_login_account}
                  />
                </div>
              </>
            )}

            <div className="employee-form-actions">
              <button type="submit" className="system-save-btn" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Employee"
                  : "Create Employee"}
              </button>

              <button
                type="button"
                className="secondary-action-btn"
                onClick={resetForm}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        <div className="admin-page-card employee-insights-card">
          <div className="admin-page-head">
            <h2>Workforce Insights</h2>
            <p>Quick overview of your current internal team structure.</p>
          </div>

          <div className="employee-insight-list">
            <div className="employee-insight-item">
              <span className="employee-insight-icon">🧑‍💼</span>
              <div>
                <strong>{managerCount} Management Role</strong>
                <p>Users assigned with manager access.</p>
              </div>
            </div>

            <div className="employee-insight-item">
              <span className="employee-insight-icon">✅</span>
              <div>
                <strong>{activeCount} Ready for Operations</strong>
                <p>Employees currently marked active in the system.</p>
              </div>
            </div>

            <div className="employee-insight-item">
              <span className="employee-insight-icon">🔒</span>
              <div>
                <strong>
                  {employees.filter((emp) => emp.login_email).length} With Login Access
                </strong>
                <p>Employees with linked internal login accounts.</p>
              </div>
            </div>

            <div className="employee-insight-item">
              <span className="employee-insight-icon">📌</span>
              <div>
                <strong>{inactiveCount} Inactive Personnel</strong>
                <p>Employees currently unavailable for active assignment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-page-card" style={{ marginTop: "24px" }}>
        <div className="admin-page-head">
          <h2>Employee Directory</h2>
          <p>Review employee information, roles, linked accounts, and status.</p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Position</th>
                <th>Role</th>
                <th>Status</th>
                <th>Login Account</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.full_name}</td>
                    <td>{employee.position}</td>
                    <td>
                      <span className={`role-pill role-${employee.role}`}>
                        {employee.role?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          employee.is_active ? "completed" : "cancelled"
                        }`}
                      >
                        {employee.employment_status}
                      </span>
                    </td>
                    <td>{employee.login_email || "No linked login"}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="secondary-action-btn"
                        onClick={() => handleToggleStatus(employee)}
                      >
                        {employee.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state-cell">
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

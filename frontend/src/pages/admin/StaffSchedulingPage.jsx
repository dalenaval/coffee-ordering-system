import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getEmployees } from "../../api/employeeService";
import {
  getStaffSchedules,
  createStaffSchedule,
  updateStaffSchedule,
  deleteStaffSchedule,
} from "../../api/staffSchedulingService";
import "./AdminPages.css";

export default function StaffSchedulingPage() {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    employee_id: "",
    shift_name: "",
    assigned_day: "",
    start_time: "",
    end_time: "",
    status: "Active",
  });

  useEffect(() => {
    fetchEmployees();
    fetchSchedules();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const data = await getStaffSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to load schedules:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      employee_id: "",
      shift_name: "",
      assigned_day: "",
      start_time: "",
      end_time: "",
      status: "Active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        employee_id: Number(form.employee_id),
      };

      if (editingId) {
        await updateStaffSchedule(editingId, payload);
      } else {
        await createStaffSchedule(payload);
      }

      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      employee_id: item.employee_id,
      shift_name: item.shift_name,
      assigned_day: item.assigned_day,
      start_time: item.start_time || "",
      end_time: item.end_time || "",
      status: item.status,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteStaffSchedule(id);
      fetchSchedules();
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  return (
    <AdminLayout title="Staff Scheduling">
      <div className="admin-page-card">
        <div className="admin-page-head">
          <h2>Assign Employee Schedule</h2>
          <p>Create and manage employee shifts and assigned days.</p>
        </div>

        <form className="admin-toolbar" onSubmit={handleSubmit}>
          <select name="employee_id" value={form.employee_id} onChange={handleChange} required>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} - {emp.position}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="shift_name"
            placeholder="Shift Name"
            value={form.shift_name}
            onChange={handleChange}
            required
          />

          <select name="assigned_day" value={form.assigned_day} onChange={handleChange} required>
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>

          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
          />

          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Off">Off</option>
          </select>

          <button type="submit">
            {editingId ? "Update Schedule" : "Assign Schedule"}
          </button>

          {editingId && (
            <button
              type="button"
              className="quick-action-btn secondary"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="admin-page-card" style={{ marginTop: "24px" }}>
        <div className="admin-page-head">
          <h2>Assigned Schedules</h2>
          <p>Current employee schedule assignments.</p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Position</th>
                <th>Shift</th>
                <th>Day</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((item) => (
                  <tr key={item.id}>
                    <td>{item.employee_name}</td>
                    <td>{item.position}</td>
                    <td>{item.shift_name}</td>
                    <td>{item.assigned_day}</td>
                    <td>
                      {item.start_time && item.end_time
                        ? `${item.start_time} - ${item.end_time}`
                        : "-"}
                    </td>
                    <td>{item.status}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="quick-action-btn secondary"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state-cell">
                    No schedules assigned yet.
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

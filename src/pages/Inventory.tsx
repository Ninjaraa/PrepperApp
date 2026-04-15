import React, { useState } from "react";
import { useInventory } from "../contexts/InventoryContext";
import type { Category, InventoryItem } from "../types";
import styles from "./Inventory.module.css";

const CATEGORIES: Category[] = [
  "Water",
  "Food",
  "Medical",
  "Communication",
  "Gear",
  "Energy",
  "Skills",
];

const CATEGORY_UNITS: Record<Category, string> = {
  Water: "L",
  Food: "kcal",
  Medical: "kits",
  Communication: "devices",
  Gear: "items",
  Energy: "items",
  Skills: "hours",
};

export default function Inventory() {
  const { items, addItem, updateItem, deleteItem } = useInventory();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filter, setFilter] = useState<Category | "All">("All");

  const [formData, setFormData] = useState({
    name: "",
    category: "Water" as Category,
    quantity: 1,
    unit: "L",
    expiryDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      expiryDate: formData.expiryDate
        ? new Date(formData.expiryDate)
        : undefined,
    };

    if (editingItem) {
      updateItem(editingItem.id, itemData);
    } else {
      addItem(itemData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Water",
      quantity: 1,
      unit: "L",
      expiryDate: "",
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate
        ? new Date(item.expiryDate).toISOString().split("T")[0]
        : "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(id);
    }
  };

  const handleCategoryChange = (category: Category) => {
    setFormData({
      ...formData,
      category,
      unit: CATEGORY_UNITS[category],
    });
  };

  const filteredItems =
    filter === "All" ? items : items.filter((item) => item.category === filter);

  const expiringItems = items.filter((item) => {
    if (!item.expiryDate) return false;
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  });

  return (
    <div className={styles.inventory}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Inventory Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
          }}
        >
          {showForm ? (
            <>
              <i className="bi bi-x-lg me-2"></i>
              Cancel
            </>
          ) : (
            <>
              <i className="bi bi-plus-lg me-2"></i>
              Add Item
            </>
          )}
        </button>
      </div>

      {expiringItems.length > 0 && (
        <div
          className="alert alert-warning alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>{expiringItems.length} items expiring within 7 days.</strong>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}

      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) =>
                      handleCategoryChange(e.target.value as Category)
                    }
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Items ({filteredItems.length})</h5>
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${filter === "All" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${filter === cat ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-muted text-center py-4">No items to display</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        item.expiryDate &&
                        new Date(item.expiryDate) <
                          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? styles.expiringRow
                          : ""
                      }
                    >
                      <td>{item.name}</td>
                      <td>
                        <span
                          className={`badge ${styles.categoryBadge} ${styles[item.category.toLowerCase()]}`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td>
                        {item.quantity} {item.unit}
                      </td>
                      <td>
                        {item.expiryDate ? (
                          <span
                            className={
                              item.expiryDate < new Date()
                                ? "text-danger fw-semibold"
                                : ""
                            }
                          >
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

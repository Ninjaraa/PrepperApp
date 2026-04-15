import { useHousehold } from "../contexts/HouseholdContext";
import { useShoppingList } from "../contexts/ShoppingContext";
import styles from "./Shopping.module.css";

export default function Shopping() {
  const { household } = useHousehold();
  const {
    shoppingItems,
    removeShoppingItem,
    toggleShoppingItem,
    clearShoppingItems,
  } = useShoppingList();

  const hasHousehold =
    household.adults > 0 || household.children > 0 || household.pets > 0;

  if (!hasHousehold) {
    return (
      <div className="text-center py-5">
        <h2>Shopping List</h2>
        <p className="text-muted mb-4">
          Please configure your household first to generate a shopping list.
        </p>
        <a href="/household" className="btn btn-primary">
          Setup Household
        </a>
      </div>
    );
  }

  return (
    <div className="shopping">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shopping List</h2>
        {shoppingItems.length > 0 && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={clearShoppingItems}
          >
            <i className="bi bi-trash me-2"></i>
            Clear All
          </button>
        )}
      </div>

      {shoppingItems.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-cart text-muted mb-3"
              style={{ fontSize: "4rem" }}
            ></i>
            <h3>Your Shopping List is Empty</h3>
            <p className="text-muted mb-4">
              Head over to the Suggestions page to add items to your shopping
              list.
            </p>
            <a href="/suggestions" className="btn btn-primary">
              View Suggestions
            </a>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th className="col-1">Done</th>
                    <th>Category</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {shoppingItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`${styles[item.category.toLowerCase()]} ${item.checked ? styles.checkedRow : ""}`}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={item.checked}
                          onChange={() => toggleShoppingItem(item.id)}
                        />
                      </td>
                      <td>
                        <span
                          className={`badge ${styles.categoryBadge} ${styles[item.category.toLowerCase()]}`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td
                        className={
                          item.checked
                            ? "text-decoration-line-through text-muted"
                            : ""
                        }
                      >
                        {item.name}
                      </td>
                      <td>{Math.round(item.quantity)}</td>
                      <td className="text-muted">{item.unit}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeShoppingItem(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-top">
              <div className="row">
                <div className="col-md-6">
                  <strong>Summary:</strong>
                  <ul className="list-unstyled mt-2">
                    <li className="mb-1">
                      <i className="bi bi-list-check me-2"></i>
                      {shoppingItems.length} items total
                    </li>
                    <li className="mb-1">
                      <i className="bi bi-bookmark-check me-2"></i>
                      {shoppingItems.filter((i) => i.checked).length} checked
                      off
                    </li>
                  </ul>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => window.print()}
                  >
                    <i className="bi bi-printer me-2"></i>
                    Print List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

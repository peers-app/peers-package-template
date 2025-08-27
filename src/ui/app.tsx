import React, { useState } from 'react';
import { registerPeersUI } from "peers-sdk";
import { appScreenId } from "../ids";

interface ListItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

const exampleItems: ListItem[] = [
  { 
    id: '1', 
    title: 'Welcome to your new package!', 
    description: 'This is an example list item to get you started.',
    completed: false,
    createdAt: new Date('2024-01-15T10:30:00')
  },
  { 
    id: '2', 
    title: 'Customize this template', 
    description: 'Update the package name, navigation, and add your own functionality.',
    completed: false,
    createdAt: new Date('2024-01-15T11:00:00')
  },
  { 
    id: '3', 
    title: 'Add your own features', 
    description: 'Replace this hello world screen with your actual application.',
    completed: false,
    createdAt: new Date('2024-01-15T11:30:00')
  },
];

function HelloWorldScreen() {
  const [items, setItems] = useState<ListItem[]>(exampleItems);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        title: newItemTitle.trim(),
        description: newItemDescription.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setItems([newItem, ...items]);
      setNewItemTitle('');
      setNewItemDescription('');
      setShowAddForm(false);
    }
  };

  const handleToggleComplete = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const completedCount = items.filter(item => item.completed).length;

  return (
    <div className="container-fluid p-4" style={{ maxHeight: '100%', overflowY: 'auto' }}>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">
              <i className="bi bi-list-ul me-2" />
              Hello World List
            </h4>
            <small className="text-muted">
              A simple list view to get you started with your package
            </small>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="bi bi-plus me-1"></i>
            Add Item
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Add New Item</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter item title..."
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Enter item description (optional)..."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={handleAddItem}
                  disabled={!newItemTitle.trim()}
                >
                  Add Item
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewItemTitle('');
                    setNewItemDescription('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-3">
                <div className="text-primary h4 mb-1">{items.length}</div>
                <small className="text-muted">Total Items</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-3">
                <div className="text-success h4 mb-1">{completedCount}</div>
                <small className="text-muted">Completed</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-3">
                <div className="text-warning h4 mb-1">{items.length - completedCount}</div>
                <small className="text-muted">Pending</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-3">
                <div className="text-info h4 mb-1">
                  {items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0}%
                </div>
                <small className="text-muted">Progress</small>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Items</h6>
          </div>
          <div className="card-body p-0">
            {items.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <i className="bi bi-list-ul fs-1 mb-3 d-block"></i>
                <p>No items yet. Click "Add Item" to get started!</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`list-group-item ${item.completed ? 'bg-light' : ''}`}
                  >
                    <div className="d-flex align-items-start">
                      <div className="form-check me-3 mt-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleComplete(item.id)}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className={`fw-bold mb-1 ${item.completed ? 'text-muted text-decoration-line-through' : ''}`}>
                          {item.title}
                        </div>
                        {item.description && (
                          <div className={`small mb-2 ${item.completed ? 'text-muted' : ''}`}>
                            {item.description}
                          </div>
                        )}
                        <small className="text-muted">
                          Created {item.createdAt.toLocaleDateString()} at {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          data-bs-toggle="dropdown"
                        >
                          <i className="bi bi-three-dots"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button 
                              className="dropdown-item text-danger"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <i className="bi bi-trash me-2"></i>
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

registerPeersUI({
  component: HelloWorldScreen,
  peersUIId: appScreenId,
});
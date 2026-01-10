import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [categories, setCategories] = useState([
    'Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles',
    'Pizza', 'Burger', 'Biryani', 'Chinese', 'South Indian', 'Beverages'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Handle Cloudinary and local images
  const getImageUrl = (img) => {
    if (img && img.startsWith('http')) {
      return img;
    }
    return `${url}/images/${img}`;
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Server error while fetching list");
    }
  };

  const removeFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id });
      if (response.data.success) {
        toast.success("Item deleted");
        setList((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Server error");
    }
  };

  const openEditModal = (item) => {
    setEditItem({ ...item });
  };

  const closeEditModal = () => {
    setEditItem(null);
    setShowAddCategory(false);
    setNewCategory('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setEditItem((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowAddCategory(false);
      toast.success(`Category "${newCategory.trim()}" added!`);
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axios.post(`${url}/api/food/update`, {
        id: editItem._id,
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        category: editItem.category
      });
      if (response.data.success) {
        toast.success("Item updated successfully!");
        setList((prev) =>
          prev.map((item) => (item._id === editItem._id ? editItem : item))
        );
        closeEditModal();
      } else {
        toast.error("Failed to update item");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Server error while updating");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-formate title">
          <strong>Image</strong>
          <strong>Name</strong>
          <strong>Category</strong>
          <strong>Price</strong>
          <strong>Action</strong>
        </div>

        {list.map((item) => (
          <div key={item._id} className="list-table-formate list-table-item">
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              onError={(e) => { e.target.src = '/default-image.png'; }}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
              <button className="delete-btn" onClick={() => removeFood(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Product</h2>

            <div className="modal-field">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={editItem.name}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-field">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={editItem.description}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-field">
              <label>Category</label>
              <div className="category-select-wrapper">
                <select
                  name="category"
                  value={editItem.category}
                  onChange={handleEditChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="add-category-btn"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                >
                  + New
                </button>
              </div>

              {showAddCategory && (
                <div className="new-category-input">
                  <input
                    type="text"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button onClick={addNewCategory}>Add</button>
                </div>
              )}
            </div>

            <div className="modal-field">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={editItem.price}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
              <button className="save-btn" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;

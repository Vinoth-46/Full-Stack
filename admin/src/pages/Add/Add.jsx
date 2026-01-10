import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Salad');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Categories list - same as List.jsx
  const [categories, setCategories] = useState([
    'Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles',
    'Pizza', 'Burger', 'Biryani', 'Chinese', 'South Indian', 'Beverages'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('Salad');
    setPrice('');
    setImage(false);
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setCategory(newCategory.trim());
      setNewCategory('');
      setShowAddCategory(false);
      toast.success(`Category "${newCategory.trim()}" added!`);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return; // Prevent double submission
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', Number(price));
    formData.append('category', category);
    formData.append('image', image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setStatus({ type: 'success', text: 'Item added successfully!' });
        toast.success(response.data.message || 'Item added successfully!');
        resetForm();
      } else {
        setStatus({ type: 'error', text: `Failed: ${response.data.message}` });
        toast.error(`Failed: ${response.data.message}`);
      }
    } catch (error) {
      setStatus({ type: 'error', text: `Error: ${error.message}` });
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }

    setTimeout(() => setStatus({ type: '', text: '' }), 3000);
  };

  return (
    <div className="add">
      {status.text && (
        <div className={`status-message ${status.type}`}>
          {status.text}
        </div>
      )}
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            type="text"
            name="name"
            placeholder="Type here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            rows="6"
            placeholder="Write content here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <div className="category-select-row">
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
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
              <div className="new-category-row">
                <input
                  type="text"
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button type="button" onClick={addNewCategory}>Add</button>
              </div>
            )}
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="number"
              name="price"
              placeholder="₹150"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? 'Adding...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default Add;

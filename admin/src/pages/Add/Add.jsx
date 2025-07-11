import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {
  

  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('salad');
  const [price, setPrice] = useState('');

  const [status, setStatus] = useState({ type: '', text: '' });

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('salad');
    setPrice('');
    setImage(false);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

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
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
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

        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;

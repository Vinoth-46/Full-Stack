import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {
 
  const [list, setList] = useState([]);

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
              src={`${url}/images/${item.image}`}
              alt={item.name}
              onError={(e) => { e.target.src = '/default-image.png'; }}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p className="delete" onClick={() => removeFood(item._id)}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;

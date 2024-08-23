import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, List, InputNumber, Upload, message, Pagination, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { saveItem, getItems } from '../utils'; 

const Table = () => {
  const [items, setItems] = useState([]);
  const [formList, setFormList] = useState([{}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({ title: '', dateRange: [] });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchItems();
  }, [currentPage, filters]);

  const fetchItems = async () => {
    try {
      
      const dateRangeFormatted = filters.dateRange.map(date => date && date.format('YYYY-MM-DD'));
  
      const response = await getItems(filters.title, dateRangeFormatted, currentPage);
  
      setItems(response.items || []);
      setTotalItems(response.total || 0); 
    } catch (error) {
      message.error('Failed to load items.');
    }
  };

  const handleAddRow = () => {
    setFormList([...formList, {}]);
  };

  const handleRemoveRow = (index) => {
    setFormList(formList.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      for (const item of formList) {
        const formData = new FormData();
        formData.append('title', item.title || '');
        formData.append('description', item.description || '');
        formData.append('quantity', item.quantity || 0);
        formData.append('price', item.price || 0);
        formData.append('date', item.date || '');

        if (item.image) {
          formData.append('image', item.image);
        }

        await saveItem(formData);
      }
      message.success('Items saved successfully.');
      fetchItems();
    } catch (error) {
      message.error('Failed to save items.');
    }
  };

  const handleImageUpload = (file, index) => {
    setFormList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, image: file } : item
      )
    );
    return false; 
  };

  const handleFilterChange = (changedValues) => {
    setFilters(prev => ({
      ...prev,
      ...changedValues
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add Items with Image Data</h1>

      <Form
        form={form}
        layout="inline"
        onValuesChange={handleFilterChange}
        style={{ marginBottom: '20px' }}
      >
        <Form.Item name="title" label="Title">
          <Input placeholder="Filter by title" />
        </Form.Item>
        <Form.Item name="dateRange" label="Date Range">
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>

      {formList.map((_, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => handleImageUpload(file, index)}
          >
            {formList[index]?.image ? (
              <img
                src={URL.createObjectURL(formList[index].image)}
                alt="avatar"
                style={{ width: '100%' }}
              />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Input
            placeholder="Title"
            style={{ marginRight: '10px', width: '150px' }}
            onChange={(e) =>
              setFormList((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, title: e.target.value } : item
                )
              )
            }
          />
          <Input
            placeholder="Description"
            maxLength={250}
            style={{ marginRight: '10px', width: '150px' }}
            onChange={(e) =>
              setFormList((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, description: e.target.value } : item
                )
              )
            }
          />
          <InputNumber
            placeholder="Quantity"
            min={0}
            style={{ marginRight: '10px', width: '80px' }}
            onChange={(value) =>
              setFormList((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, quantity: value } : item
                )
              )
            }
          />
          <InputNumber
            placeholder="Price"
            min={0}
            style={{ marginRight: '10px', width: '100px' }}
            onChange={(value) =>
              setFormList((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, price: value } : item
                )
              )
            }
          />
          <DatePicker
            style={{ marginRight: '10px', width: '150px' }}
            onChange={(date, dateString) =>
              setFormList((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, date: dateString } : item
                )
              )
            }
          />
          <Button type="link" onClick={handleAddRow} style={{ marginRight: '10px' }}>
            +
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleRemoveRow(index)}
          >
            -
          </Button>
        </div>
      ))}

      <Button type="primary" onClick={handleSave}>
        Save
      </Button>

      <h2 style={{ marginTop: '20px' }}>Saved Items</h2>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<img src={item.image ? `data:image/jpeg;base64,${item.image}` : 'https://via.placeholder.com/50'} alt="img" />}
              title={<strong>{item.title}</strong>}
              description={
                <>
                  <div>{item.description}</div>
                  <div>quantity: {item.quantity}, Price: ${item.price}, Date: {item.date}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={10}
        total={totalItems}
        onChange={handlePageChange}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default Table;

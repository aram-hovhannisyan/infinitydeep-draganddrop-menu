import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon, Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';


const MenuItem = ({ item, index, parentId, onEdit, onDelete, onCreateChild, onMoveItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [newText, setNewText] = useState(item.text);

  const ref = useRef(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'menuItem',
    item: { id: item.id, index, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'menuItem',
    drop: (droppedItem) => {
      if (droppedItem.id !== item.id) {
        onMoveItem(droppedItem.id, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleEdit = () => {
    setIsEditing(true);
  };
  if (item.newCreated){
    handleEdit()
  }
  const handleSave = () => {
    onEdit(item.id, newText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const handleCreateChild = () => {
    const newChildItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Child Item',
      children: [],
      parentId: item.id,
    };
    onCreateChild(item.id, newChildItem);
  };

  const handleInputChange = (e) => {
    setNewText(e.target.value);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  const renderChildren = () => {
    if (!isExpanded || !item.children || item.children.length === 0) {
      return null;
    }

    return (
      <ul style={{ paddingLeft: '20px' }}>
        {item.children.map((childItem, childIndex) => (
          <MenuItem
            key={childItem.id}
            item={childItem}
            index={childIndex}
            parentId={item.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreateChild={onCreateChild}
            onMoveItem={onMoveItem}
          />
        ))}
      </ul>
    );
  };

  dragRef(drop(ref));

  const elementStyle = {
    minWidth: '450px',
    maxWidth: '600px',
    backgroundColor: isOver ? 'lightblue' : 'inherit',
    marginBottom: '10px',
    padding: '0 10px',
    borderRadius: '5px',
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
    transition: 'height 0.2s',
    height: isExpanded ? 'auto' : '60px',
    listStyleType: 'none',
    border: '2px solid black',
  };

  const nameStyle = {
    flexGrow: 1,
    width: '100%', // Set equal width for all names
  };

  const buttonStyle = {
    marginLeft: '10px',
  };

  return (
    <li ref={ref} style={elementStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography style={nameStyle}>{item.text} [{item.children.length}]</Typography>
        <IconButton style={buttonStyle} onClick={handleToggleExpand}>
          {isExpanded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
        <IconButton style={buttonStyle} onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton style={buttonStyle} onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton style={buttonStyle} onClick={handleCreateChild}>
          <AddIcon style={{ borderRadius: '50%', border: '2px solid gray' }} />
        </IconButton>
      </div>
      {isEditing ? (
        <div style={{height: '40px'}}>
          <TextField value={newText} onChange={handleInputChange} />
          <Button onClick={handleSave} variant="contained" color="primary" style={{height: '30px'}}>
            Save
          </Button>
        </div>
      ) : (
        renderChildren()
      )}
    </li>
  );
};
export const handleEdit = MenuItem.handleEdit
export default MenuItem
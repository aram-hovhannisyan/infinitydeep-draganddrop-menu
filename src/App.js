import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button} from '@material-ui/core';
import MenuItem from './components/menu';

const App = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 'item-1',
      text: 'Item 1',
      children: [
        {
          id: 'item-1-1',
          text: 'Item 1-1',
          children: [],
          parentId: 'item-1',
        },
        {
          id: 'item-1-2',
          text: 'Item 1-2',
          children: [],
          parentId: 'item-1',
        },
      ],
      parentId: null,
    },
    {
      id: 'item-2',
      text: 'Item 2',
      children: [],
      parentId: null,
    },
  ]);

  const handleDelete = (itemId) => {
    setMenuItems((prevMenuItems) => {
      const deleteItem = (items, itemId) => {
        return items.filter((item) => {
          if (item.id === itemId) {
            return false;
          }
          if (item.children && item.children.length > 0) {
            item.children = deleteItem(item.children, itemId);
          }
          return true;
        });
      };

      return deleteItem(prevMenuItems, itemId);
    });
  };

  const handleEdit = (itemId, newText) => {
    setMenuItems((prevMenuItems) => {
      const editItem = (items, itemId, newText) => {
        return items.map((item) => {
          if (item.id === itemId) {
            return { ...item, text: newText };
          }
          if (item.children && item.children.length > 0) {
            item.children = editItem(item.children, itemId, newText);
          }
          return item;
        });
      };

      return editItem(prevMenuItems, itemId, newText);
    });
  };

  const handleCreateChild = (parentId, newChildItem) => {
    setMenuItems((prevMenuItems) => {
      const createChildItem = (items, parentId, newChildItem) => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...item.children, newChildItem],
            };
          }
          if (item.children && item.children.length > 0) {
            item.children = createChildItem(item.children, parentId, newChildItem);
          }
          return item;
        });
      };
      
      return createChildItem(prevMenuItems, parentId, newChildItem);
    });
  };

  const handleMoveItem = (itemId, parentId) => {
    setMenuItems((prevMenuItems) => {
      const moveItem = (items, itemId, parentId) => {
        let updatedItems = items;

        const findItem = (items, itemId) => {
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemId) {
              return { item: items[i], index: i };
            }
            if (items[i].children && items[i].children.length > 0) {
              const foundItem = findItem(items[i].children, itemId);
              if (foundItem) {
                return foundItem;
              }
            }
          }
          return null;
        };

        const foundItem = findItem(updatedItems, itemId);
        if (foundItem) {
          const { item, index } = foundItem;
          const itemClone = { ...item };
          updatedItems = deleteItem(updatedItems, itemId);
          updatedItems = insertItem(updatedItems, itemClone, parentId, index);
        }

        return updatedItems;
      };

      const deleteItem = (items, itemId) => {
        return items.filter((item) => {
          if (item.id === itemId) {
            return false;
          }
          if (item.children && item.children.length > 0) {
            item.children = deleteItem(item.children, itemId);
          }
          return true;
        });
      };

      const insertItem = (items, itemToInsert, parentId, index) => {
        return items.map((item) => {
          if (item.id === parentId) {
            const updatedChildren = item.children ? [...item.children] : [];
            updatedChildren.splice(index, 0, itemToInsert);
            return { ...item, children: updatedChildren };
          }
          if (item.children && item.children.length > 0) {
            item.children = insertItem(item.children, itemToInsert, parentId, index);
          }
          return item;
        });
      };

      return moveItem(prevMenuItems, itemId, parentId);
    });
  };

  const handleAddParent = () => {
    const newParentItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Parent Item',
      children: [],
      parentId: null,
    };
    setMenuItems((prevMenuItems) => [...prevMenuItems, newParentItem]);
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <ul>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              item={item}
              index={index}
              parentId={null}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreateChild={handleCreateChild}
              onMoveItem={handleMoveItem}
            />
          ))}
        </ul>
      </DndProvider>
      <Button variant="contained" color="primary" onClick={handleAddParent}>
        Add Parent
      </Button>
    </div>
  );
};

export default App;

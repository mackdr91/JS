// Get elements
const itemList = document.getElementById('itemsList');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const itemInput = document.getElementById('itemInput');
const itemForm = document.getElementById('itemForm');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Display items from local storage on page load
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}

// Handle form submission to add a new item
function onAddItemSubmit(e) {
    e.preventDefault();
  
    const newItem = itemInput.value.trim();
  
    // Validate input
    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    // Handle Edit Mode
    if (isEditMode) {
        handleEditMode(newItem);
    } else {
        // Add item to DOM and local storage
        addItemToDOM(newItem);
        addItemToStorage(newItem);
    }

    checkUI();
  
    // Clear input
    itemInput.value = '';
}

// Handle Edit Mode
function handleEditMode(newItem) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    if (itemToEdit) {
        const oldItemText = itemToEdit.firstChild.textContent.trim();

        // Remove old item from storage
        removeItemFromStorage(oldItemText);

        // Update the item in the DOM
        itemToEdit.firstChild.textContent = newItem;

        // Add the updated item to storage
        addItemToStorage(newItem);

        // Remove the edit mode class
        itemToEdit.classList.remove('edit-mode');

        // Reset edit mode flag
        isEditMode = false;

        // Update button text
        formBtn.textContent = 'Add Item';
        formBtn.style.backgroundColor = '';
    }
}

// Add item to the DOM
function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
  
    const button = createButton('remove-item');
    li.appendChild(button);
  
    itemList.appendChild(li);
}

// Add item to local storage
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Get items from local storage
function getItemsFromStorage() {
    return localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
}

// Remove item from DOM and local storage
function removeItem(e) {
    if (e.target.classList.contains('remove-item')) {
        if (confirm('Are you sure?')) {
            const item = e.target.parentElement;
            const itemText = item.firstChild.textContent.trim();
            item.remove();

            removeItemFromStorage(itemText);
            checkUI();
        }
    } else if (e.target.tagName === 'LI') {
        setItemToEdit(e.target);
    }
}

// Set item to edit mode
function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.textContent = 'Edit Item';
    itemInput.value = item.firstChild.textContent.trim();
    formBtn.style.backgroundColor = 'purple';
}

// Remove item from local storage
function removeItemFromStorage(itemText) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter(item => item !== itemText);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Create a button element
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    button.textContent = 'delete';
    return button;
}

// Filter items based on input
function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        item.style.display = itemName.includes(text) ? 'flex' : 'none';
    });
}

// Clear all items from the list and local storage
clearBtn.addEventListener('click', function () {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
});

// Check UI state and toggle visibility of clear and filter buttons
function checkUI() {
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
}

// Dark mode toggle
document.getElementById('dark-mode').addEventListener('click', function() {
    const container = document.getElementById('app-container');
    const h1 = document.querySelector('h1');
    const items = document.querySelectorAll('li');
    const modeBtn = document.getElementById('dark-mode');
    const buttons = document.querySelectorAll('button');

    container.classList.toggle('dark');

    if (container.classList.contains('dark')) {
        container.style.backgroundColor = 'black';
        h1.style.color = 'white';
        modeBtn.textContent = 'light';

        buttons.forEach(button => button.style.backgroundColor = 'blue');
        items.forEach(item => item.style.backgroundColor = 'grey');
    } else {
        container.style.backgroundColor = '';
        h1.style.color = '';
        modeBtn.textContent = 'dark';

        buttons.forEach(button => button.style.backgroundColor = '');
        items.forEach(item => item.style.backgroundColor = '');
    }
});

// Initialize event listeners and display items on page load
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    document.addEventListener('DOMContentLoaded', displayItems);
    itemList.addEventListener('click', removeItem);
    itemFilter.addEventListener('input', filterItems);

    checkUI();
}

init();
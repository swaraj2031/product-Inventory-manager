
import {useState, useEffect} from 'react'

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  AlertTriangle,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Boxes,
  IndianRupee,
} from 'lucide-react'

import './App.css'

const initialProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 2499,
    quantity: 12,
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 3999,
    quantity: 3,
    category: 'Electronics',
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 1999,
    quantity: 8,
    category: 'Fashion',
  },
  {
    id: 4,
    name: 'Office Chair',
    price: 5499,
    quantity: 2,
    category: 'Furniture',
  },
  {
    id: 5,
    name: 'Water Bottle',
    price: 499,
    quantity: 25,
    category: 'Accessories',
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    price: 1799,
    quantity: 4,
    category: 'Electronics',
  },
]

const emptyForm = {
  name: '',
  price: '',
  quantity: '',
  category: 'Electronics',
}

const formatPrice = amount =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

function App() {
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem('inventory-products')
      return savedProducts ? JSON.parse(savedProducts) : initialProducts
    } catch {
      return initialProducts
    }
  })

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  // Sidebar navigation state
  const [activeMenu, setActiveMenu] = useState('Dashboard')

  useEffect(() => {
    localStorage.setItem('inventory-products', JSON.stringify(products))
  }, [products])

  // Statistics
  const totalProducts = products.length

  const totalStock = products.reduce(
    (total, product) => total + Number(product.quantity),
    0,
  )

  const lowStockProducts = products.filter(
    product => Number(product.quantity) < 5,
  )

  const totalValue = products.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.quantity),
    0,
  )

  // Search and category filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || product.category === category

    const matchesMenu =
      activeMenu !== 'Inventory' || Number(product.quantity) < 5
        ? true
        : false

    return matchesSearch && matchesCategory && matchesMenu
  })

  // Open add product form
  const openAddModal = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setShowModal(true)
  }

  // Open edit product form
  const openEditModal = product => {
    setEditingId(product.id)

    setFormData({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category,
    })

    setShowModal(true)
  }

  // Handle input changes
  const handleInputChange = event => {
    const {name, value} = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  // Add or update product
  const handleSubmit = event => {
    event.preventDefault()

    const newProduct = {
      id: editingId || Date.now(),
      name: formData.name.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      category: formData.category,
    }

    if (editingId) {
      setProducts(previous =>
        previous.map(product =>
          product.id === editingId ? newProduct : product,
        ),
      )
    } else {
      setProducts(previous => [...previous, newProduct])
    }

    setShowModal(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  // Delete product
  const deleteProduct = id => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (shouldDelete) {
      setProducts(previous =>
        previous.filter(product => product.id !== id),
      )
    }
  }

  // Sidebar menu navigation
  const handleMenuClick = menu => {
    setActiveMenu(menu)
    setSearch('')
    setCategory('All')
  }

  // Change page heading
  const pageTitle =
    activeMenu === 'Dashboard'
      ? 'Inventory Overview'
      : activeMenu === 'Inventory'
        ? 'Low Stock Inventory'
        : 'All Products'

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Boxes size={25} />
          </div>

          <h2>Stockly</h2>
        </div>

        <p className="menu-label">MENU</p>

        <div
          className={`menu-item ${activeMenu === 'Dashboard' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div
          className={`menu-item ${activeMenu === 'Inventory' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Inventory')}
        >
          <Package size={20} />
          <span>Inventory</span>
        </div>

        <div
          className={`menu-item ${activeMenu === 'Products' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Products')}
        >
          <ShoppingCart size={20} />
          <span>Products</span>
        </div>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">S</div>

            <div>
              <h4>Admin User</h4>
              <p>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Workspace / {activeMenu}
            </p>

            <h1>{pageTitle}</h1>

            <p className="subtitle">
              Manage your products and monitor your stock levels.
            </p>
          </div>

          <button className="add-button" onClick={openAddModal}>
            <Plus size={19} />
            Add Product
          </button>
        </header>

        {/* Dashboard Statistics */}
        {activeMenu === 'Dashboard' && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">
                  <Package size={23} />
                </div>

                <p>Total Products</p>
                <h2>{totalProducts}</h2>
                <span>Products in inventory</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">
                  <Boxes size={23} />
                </div>

                <p>Total Stock Units</p>
                <h2>{totalStock}</h2>
                <span>Available units</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">
                  <AlertTriangle size={23} />
                </div>

                <p>Low Stock Items</p>
                <h2>{lowStockProducts.length}</h2>
                <span>Products below 5 units</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <IndianRupee size={23} />
                </div>

                <p>Stock Value</p>
                <h2>{formatPrice(totalValue)}</h2>
                <span>Total inventory value</span>
              </div>
            </section>

            {lowStockProducts.length > 0 && (
              <section className="alert-box">
                <div className="alert-icon">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <h3>Low stock alert</h3>

                  <p>
                    {lowStockProducts.length} product(s) have less than
                    5 units. Consider restocking them.
                  </p>
                </div>
              </section>
            )}
          </>
        )}

        {/* Product Inventory */}
        <section className="products-section">
          <div className="section-header">
            <div>
              <h2>
                {activeMenu === 'Inventory'
                  ? 'Low Stock Products'
                  : activeMenu === 'Products'
                    ? 'All Products'
                    : 'Product Inventory'}
              </h2>

              <p>
                {activeMenu === 'Inventory'
                  ? 'Products that need restocking.'
                  : 'View and manage all your products.'}
              </p>
            </div>

            <span className="product-count">
              {filteredProducts.length} Products
            </span>
          </div>

          {/* Search and Filter */}
          <div className="filters">
            <div className="search-box">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={event => setCategory(event.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Products Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>PRODUCT NAME</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>QUANTITY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-name">
                          <div className="product-avatar">
                            {product.name.charAt(0).toUpperCase()}
                          </div>

                          <strong>{product.name}</strong>
                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {product.category}
                        </span>
                      </td>

                      <td>{formatPrice(product.price)}</td>

                      <td>
                        <strong>{product.quantity}</strong>
                      </td>

                      <td>
                        {product.quantity < 5 ? (
                          <span className="status low">
                            Low Stock
                          </span>
                        ) : (
                          <span className="status available">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => openEditModal(product)}
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => deleteProduct(product.id)}
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-message">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add / Edit Product Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div>
                  <h2>
                    {editingId ? 'Edit Product' : 'Add New Product'}
                  </h2>

                  <p>
                    {editingId
                      ? 'Update your product details.'
                      : 'Enter the details of your new product.'}
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                  aria-label="Close form"
                >
                  <X size={21} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Product Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <div className="form-row">
                  <div>
                    <label htmlFor="price">Price (₹)</label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity">Quantity</label>

                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Enter quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Accessories">Accessories</option>
                </select>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-button">
                    {editingId ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

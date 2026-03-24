// frontend/src/components/CreateOrder.js
import React, { useState, useEffect } from "react";
import { fetchCustomers, fetchProducts, createOrder } from "../api";

function CreateOrder() {

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await fetchCustomers();
        setCustomers(Array.isArray(customersData) ? customersData : []);

        const productsData = await fetchProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError("Could not connect to server");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.id === parseInt(selectedProduct));
      setSelectedProductData(product);
    }
  }, [products, selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({
        customer_id: customerId,
        product_id: selectedProduct,
        quantity: quantity,
        shipping_address: shippingAddress
      });
      alert("Order created successfully!");
      setCustomerId("");
      setSelectedProduct("");
      setQuantity(1);
      setShippingAddress("");
    } catch (err) {
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create Order</h2>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Product</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (${product.price})
              </option>
            ))}
          </select>
        </div>

        {selectedProductData && (
          <p>Price: ${selectedProductData.price} | Stock: {selectedProductData.inventory_count}</p>
        )}

        <div>
          <label>Quantity</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div>
          <label>Shipping Address</label>
          <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
        </div>

        <button type="submit">Create Order</button>
      </form>
    </div>
  );
}

export default CreateOrder;

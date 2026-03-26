import './ProductCatalog.css';
import ProductCard from './ProductCard';
import { useState } from 'react';
import { categoryData } from '../../data/categoryData';
import { productData } from '../../data/productData';

const ProductCatalog = ({ onCustomize }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(categoryData)];

  const filteredProducts =
    selectedCategory === 'all'
      ? productData
      : productData.filter((p) => p.category === selectedCategory);

  return (
    <div className="catalog-container">
      <div className="category-wrapper">
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onCustomize={onCustomize}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;

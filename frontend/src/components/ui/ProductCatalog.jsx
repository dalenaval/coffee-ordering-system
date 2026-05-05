import './ProductCatalog.css'
import ProductCard from './ProductCard'
import { useGetCategories } from '@/hooks/useGetCategories'
import { useState } from 'react'
import { useGetProduct } from '@/hooks/useProductQuery'
import { toCapitalize } from '@/utils/toCapitalize'

const ProductCatalog = ({ onClick }) => {
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: 'all',
  })

  const { data: categories } = useGetCategories()
  const categoriesList = [{ id: 0, name: 'all' }, ...(categories || [])]

  const { data: products, isLoading } = useGetProduct(selectedCategory)

  const onSelectCategory = (category) => {
    setSelectedCategory(category)
  }

  const renderProductUI = () => {
    if (isLoading) return <div className="loading">Brewing your menu...</div>

    if (products?.length === 0) return <div className="no-products">No products found in this category.</div>

    return (
      <div className="product-grid">
        {products?.map((product) => (
          <ProductCard key={product?.id} product={product} onClick={onClick} />
        ))}
      </div>
    )
  }
  return (
    <div className="catalog-container">
      <div className="category-wrapper">
        <div className="category-filter">
          {categoriesList?.map((category, index) => (
            <button
              key={index}
              className={`category-button ${selectedCategory?.name === category?.name ? 'active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              {toCapitalize(category?.name)}
            </button>
          ))}
        </div>
      </div>

      {renderProductUI()}
    </div>
  )
}

export default ProductCatalog

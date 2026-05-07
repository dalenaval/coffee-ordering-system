import OptionItems from './OptionItems'
import './OptionGroup.css'

const OptionGroup = ({ attribute, selectedMenu, setSelectedMenu }) => {
  const groupId = attribute?.id

  const handleSelect = (item) => {
    setSelectedMenu((prev) => {
      const current = prev[groupId]
      if (attribute?.is_many) {
        const updated = Array.isArray(current) ? [...current] : []

        const exist = updated.find((i) => i.id === item.id)

        if (exist) {
          return { ...prev, [groupId]: updated.filter((i) => i.id !== item.id) }
        } else {
          if (updated.length < attribute.max_count) {
            updated.push(item)
          }
        }
        return { ...prev, [groupId]: updated }
      } else {
        return { ...prev, [groupId]: item }
      }
    })
  }

  return (
    <div className="container">
      <div className="container-content">
        <h3>
          {attribute?.name} <span></span>
        </h3>
      </div>
      <div className="options-list">
        {attribute?.items?.map((item) => {
          const selected = selectedMenu[groupId]
          const isSelected = attribute?.is_many ? selected?.some((e) => e?.id === item?.id) : selected?.id === item?.id
          return <OptionItems item={item} isSelected={isSelected} key={item?.id} onClick={handleSelect} />
        })}
      </div>
    </div>
  )
}

export default OptionGroup

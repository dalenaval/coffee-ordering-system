import OptionItems from "./OptionItems";
import "./OptionGroup.css";

const OptionGroup = ({ attribute, selectedOptions, setSelectedOptions }) => {
  const isMany = attribute?.max_count > 1;
  const groupId = attribute?.id;

  const handleSelect = (item) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId];
      console.log("isMany", isMany);
      if (isMany) {
        const updated = Array.isArray(current) ? [...current] : [];

        const exist = updated.find((i) => i.id === item.id);

        console.log("updated", updated);
        console.log("exist", exist);
        console.log("current", current);
        console.log("item", item);
        if (exist) {
          console.log("meron na");
          updated.filter((i) => {
            console.log("compare", i.id !== item.id);
            i.id !== item.id;
          });
          console.log("after", updated);
        } else {
          if (updated.length < attribute.max_count) {
            updated.push(item);
          }
        }

        return { ...prev, [groupId]: updated };
      } else {
        console.log("1");
        return { ...prev, [groupId]: item };
      }
    });
  };
  return (
    <div className="container">
      <div className="container-content">
        <h3>
          {attribute?.name} <span></span>
        </h3>
      </div>
      <div className={isMany ? "options-grid" : "options-list"}>
        {attribute?.items?.map((item) => {
          const selected = selectedOptions[groupId];
          const isSelected = isMany
            ? selected?.some((e) => e?.id === item?.id)
            : selected?.id === item?.id;
          return (
            <OptionItems
              item={item}
              isSelected={isSelected}
              key={item?.id}
              onClick={handleSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OptionGroup;

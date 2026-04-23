import { Bike, ShoppingBag, Utensils } from 'lucide-react'

const orderTypes = [
  {
    id: 1,
    name: 'Dine In',
    icon: <Utensils />,
    description: 'Enjoy your order at our cafe',
    value: 'dine-in',
  },
  {
    id: 2,
    name: 'Takeout',
    icon: <ShoppingBag />,
    description: 'Pick up your order to go',
    value: 'take-out',
  },
  {
    id: 3,
    name: 'Delivery',
    icon: <Bike />,
    description: 'Get your order delivered',
    value: 'delivery',
  },
]

export default orderTypes

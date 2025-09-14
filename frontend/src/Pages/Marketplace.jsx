import React from 'react'
import ListedProductButton from '../Components/ListedProductButton'
import SelledProductButton from '../Components/SelledProductButton'
import AddProductButton from '../Components/AddProductButton'
import AllMarketProduct from '../Components/AllMarketProduct'


const Marketplace = () => {
  return (
    <div>
      
      <div className='flex gap-3'>
        <AddProductButton/>
        <ListedProductButton/>
        <SelledProductButton/>
      </div>

   

      <AllMarketProduct/>
    </div>
  )
}

export default Marketplace

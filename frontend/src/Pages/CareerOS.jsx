import React, { useState } from 'react'
import Unselectedpath from '../Components/Unselectedpath'

const CareerOS = () => {

  const[pathSelected,setPathSelected] = useState(false)

  return (
    <div className='w-full'>
      {
        pathSelected ? (
          <div>
            pathselectred
          </div>
        ) : (
          <div>
            <Unselectedpath/>
          </div>
        )
      }
    </div>
  )
}

export default CareerOS

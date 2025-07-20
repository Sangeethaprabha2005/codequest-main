import React from 'react'
import Leftsidebar from '../../component/Leftsidebar/Leftsidebar'
import Rightsidebar from '../../component/Rightsidebar/Rightsidebar'
import Qustiondetails from './Qustiondetails'
const Displayquestion = ({slidein}) => {
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein}/>
      <div className="home-container-2">
        <Qustiondetails/>
        <Rightsidebar/>
      </div>
    </div>
  )
}

export default Displayquestion
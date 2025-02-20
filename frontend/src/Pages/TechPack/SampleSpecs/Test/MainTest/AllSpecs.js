// import React from 'react'
// import SampleSpecsTable from '../../components/SampleSpecsTable'
// import SampleSpecsPack from '../../components/SampleSpecsPack'
// import SampleSpecForm from '../../Tab/Tabs'
// function AllSpecs() {
//   return (
//     <div>
     
//          <SampleSpecsPack/>
//         <SampleSpecsTable/>
//        <SampleSpecForm/>
//     </div>
//   )
// }

// export default AllSpecs
import React from 'react'
import SampleSpecsTable from '../../components/SampleSpecsTable'
import SampleSpecsPack from '../../components/SampleSpecsPack'
import SampleSpecForm from '../../Tab/Tabs'

function AllSpecs({ selectedTab, dataAvailable }) {
    console.log("data available",dataAvailable);
  return (
    <div>
      {selectedTab === 0 ? (
      
        <SampleSpecForm />
      ) : dataAvailable ? (
      
        <>
          <SampleSpecsPack />
          <SampleSpecsTable />
        </>
      ) : null}
    </div>
  );
}

export default AllSpecs;

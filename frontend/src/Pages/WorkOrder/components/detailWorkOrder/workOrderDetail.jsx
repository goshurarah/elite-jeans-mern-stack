import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../../../Navbar/Navbar';
import WorkDetail from './component/WorkDetail';
import StyleDetail from './component/styleDetail';
import SampleRequestList from './component/SampleRequest/SampleRequest';
import ItemDetails from './component/ItemDetail/ItemDetails';
import WashDetail from './component/WashDetail/WashDetail';

function WorkOrderDetail() {
  const { id } = useParams();  
  
  return (
    <div>
      <Navbar />
      <WorkDetail techPackId={id} />
      <ItemDetails techPackId={id} />
      <StyleDetail techPackId={id} />
      <WashDetail techPackId={id} />
      <SampleRequestList techPackId={id} />
    </div>
  );
}

export default WorkOrderDetail;

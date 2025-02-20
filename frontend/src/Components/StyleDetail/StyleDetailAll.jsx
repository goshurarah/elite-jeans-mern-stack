import React from "react";
import StyleDetail from "./styleDetail";
import StyleImage from "./styleImage";

function StyleDetailAll({ techPackId }) {
 
  return (
    <div>
      <StyleDetail techPackId={techPackId}/>
      {/* <StyleImage /> */}
    </div>
  );
}

export default StyleDetailAll;

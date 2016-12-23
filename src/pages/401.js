import React from 'react';


const ForbiddenPage = () => (
  <div className="ui middle aligned center aligned padded grid"
       style={{ width: '100%', background: 'rgb(27,28,29)'}}>
    <div className="row">
      <div className="column">
        <h1 className="ui inverted header">
          401
          <div className="sub header">
            Недостаточно прав
          </div>
        </h1>
      </div>
    </div>
  </div>
);

export default ForbiddenPage;

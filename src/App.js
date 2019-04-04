import React, { Component } from 'react';
import readXlsxFile from 'read-excel-file';
import './App.css';

import Summary from './components/Summary';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSets: [],
    };
  };

  objectify = (data) => {
    const [labels] = data;
    const output = data.slice(1).map(item => item.reduce((obj, val, index) => {
      const key = labels[index].replace(/ /g, '').toLowerCase();
      obj[key] = val;
      return obj;
    }, {}));

    return output;
  }

  onWorkSheetChange = () => {
    const { dataSets } = this.state;
    const input = document.getElementById('input');

    readXlsxFile(input.files[0]).then((rows) => {
      const output = this.objectify(rows);
      // console.log(output);

      this.setState({ dataSets: [...dataSets, output] });
    })
  };

  render() {
    const { dataSets } = this.state;

    return (
      <div className="app-div container">
        <div className="row">
          <div className="col-md-12 text-right">
            <div className="file-field">
              <div className="btn">
                <span><i className="fas fa-plus"></i> Seleccionar archivo</span>
                <input type="file" onChange={this.onWorkSheetChange} className="filetype" id="input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></input>
              </div>
            </div>
          </div>
        </div>
        {
          dataSets.map((d, i) => <Summary key={i} data={d} />)
        }
      </div >
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import * as randomColor from 'randomcolor';

class Summary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      extra: {},
      chartData: {
        bar: { labels: [], datasets: [{ label: 'Personas', data: [] }] },
        pie: { labels: [], datasets: [{ label: 'Grados', data: [] }] },
      },
    };
  };

  componentDidMount() {
    const { data } = this.props;
    const { chartData: { bar, pie } } = this.state;
    const chartData = {};

    chartData.bar = data.reduce((dObj, d) => {
      const { labels, datasets } = dObj;
      const [{ label, data }] = datasets;

      dObj.labels = [...labels, `${d.nombres} ${d.apellidopaterno} ${d.apellidomaterno}`];

      dObj.datasets = [{ label, data: [...data, d.calificacion] }];

      return dObj;
    }, { ...bar });

    const ordenado = data.sort((first, second) => second.calificacion - first.calificacion);
    const promedio = ordenado.reduce((acc, x) => acc + x.calificacion, 0) / ordenado.length;

    let [mejor] = ordenado;
    mejor = `${mejor.nombres} ${mejor.apellidopaterno} ${mejor.apellidomaterno}`;
    let peor = ordenado[ordenado.length - 1];
    peor = `${peor.nombres} ${peor.apellidopaterno} ${peor.apellidomaterno}`;

    const grados = [...new Set(data.map(d => d.grado))]
      .map((grado) => ({
        grado,
        data: data.filter(d => d.grado === grado),
        color: randomColor(),
      }));

    chartData.pie = grados.reduce((dObj, d) => {
      const { grado, color, data: dData } = d;
      const { labels, datasets } = dObj;
      const [{ label, data, backgroundColor = [] }] = datasets;

      const promedio = dData.reduce((acc, x) => acc + x.calificacion, 0) / dData.length;

      dObj.labels = [...labels, `Grado ${grado}`];

      dObj.datasets = [{
        label,
        backgroundColor: [...backgroundColor, color],
        data: [...data, promedio],
      }];

      return dObj;
    }, { ...pie });

    this.setState({ chartData, extra: { mejor, peor, promedio }, loading: false });
  };

  render() {
    const {
      loading,
      chartData: { bar, pie },
      extra: { mejor, peor, promedio },
    } = this.state;

    return (
      <div className='summary-div'>
        {
          (loading) ?
            <p>Loading....</p> :
            <>
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 col-sm-12 col-12">
                          <p>
                            <span>Mejor calificación</span><br />
                            <span><b>{mejor}</b></span>
                          </p>
                        </div>
                        <div className="col-md-4 col-sm-12 col-12">
                          <p>
                            <span>Peor calificación</span><br />
                            <span><b>{peor}</b></span>
                          </p>
                        </div>
                        <div className="col-md-4 col-sm-12 col-12">
                          <p>
                            <span>Promedio</span><br />
                            <span><b>{promedio}</b></span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      < Bar
                        data={bar}
                        width={400}
                        height={400}
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      < Pie
                        data={pie}
                        width={400}
                        height={400}
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <br></br>
            </>
        }
      </div>
    );
  }
};

export default Summary;

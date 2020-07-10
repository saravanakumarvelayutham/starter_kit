import React, { Component } from 'react';

class Ride extends Component {

  render() {
    return (
      <div>
        <h1>Add Ride</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const src = this.source.value
          const dst = this.dest.value
          const prc = window.web3.utils.toWei(this.price.value.toString(), 'Ether')
          this.props.createRide(src, dst, prc)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="source"
              type="text"
              ref={(input) => { this.source = input }}
              className="form-control"
              placeholder="Source"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="dest"
              type="text"
              ref={(input) => { this.dest = input }}
              className="form-control"
              placeholder="Destination"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="price"
              type="text"
              ref={(input) => { this.price = input }}
              className="form-control"
              placeholder="Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Request Ride</button>
        </form>
        <p>&nbsp;</p>
        <h2>Manage Ride</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">SRC</th>
              <th scope="col">DST</th>
              <th scope="col">PRICE</th>
              <th scope="col">BOOKED</th>
              <th scope="col">PAID</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="rideList">
            { this.props.rides.map((ride, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{ride.id.toString()}</th>
                  <td>{ride.start}</td>
                  <td>{ride.end}</td>
                  <td>{window.web3.utils.fromWei(ride.price.toString(), 'ether')} SHR</td>
                  <td>{ride.booked ? 'Yes' : 'No'}</td>
                  <td>{ride.paid ? 'Yes' : 'No' }</td>
                  <td>
                    { !ride.booked
                      ? <button
                          name={ride.id}
                          value={ride.price}
                          onClick={(event) => {
                            this.props.giveRide(event.target.name)
                          }}
                        >
                          Give Ride
                        </button>
                      : null
                    }
                    </td>
                    <td>
                    { !ride.paid
                      ? <button
                          name={ride.id}
                          value={ride.price}
                          onClick={(event) => {
                            this.props.giveRide(event.target.name)
                          }}
                        >
                          Pay Ride
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Ride;
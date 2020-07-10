import React, { Component } from 'react';
import Web3 from 'web3'
import ShareItRide from '../abis/ShareItRide.json'
import Ride from './Ride';

class Rides extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marketplace : {},
      account: '',
      ridesCount: 0,
      rides: [],
      loading: true
    }

    this.createRide = this.createRide.bind(this)
    this.giveRide = this.giveRide.bind(this)
    this.payRide = this.payRide.bind(this)
  }

    async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
    
      async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = ShareItRide.networks[networkId]
        if(networkData) {
          const marketplace = new web3.eth.Contract(ShareItRide.abi, networkData.address)
          this.setState({ marketplace })
          const ridesCount = await marketplace.methods.ridesCount().call()
          this.setState({ ridesCount })
          // Load products
          for (var i = 1; i <= ridesCount; i++) {
            const ride = await marketplace.methods.rides(i).call()
              this.setState({
                rides: [...this.state.rides, ride]
              })
          }
          this.setState({ loading: false})
        } else {
          window.alert('ShareIt contract not deployed to detected network.')
        }
      }

      createRide(start, end , price) {
        this.setState({ loading: true })
        this.state.marketplace.methods.createRide(start,end, price).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          this.setState({ loading: false })
        })
      }
    
      giveRide(id) {
        this.setState({ loading: true })
        this.state.marketplace.methods.giveRide(id).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          this.setState({ loading: false })
        })
      }

      payRide(id) {
        this.setState({ loading: true })
        this.state.marketplace.methods.payRide(id).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          this.setState({ loading: false })
        })
      }

      render() {
        return (
            <div>
                { this.state.loading
                  ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  : <Ride
                    rides={this.state.rides}
                    createRide={this.createRide}
                    giveRide={this.giveRide} 
                    payRide = {this.payRide}/>
                }
            </div>
        );
      }
}

export default Rides;
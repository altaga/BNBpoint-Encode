// Basic Imports
import React from 'react'
import reactAutobind from 'react-autobind';

const ContextModule = React.createContext()

// Context Provider Component

class ContextProvider extends React.Component {
  // define all the values you want to use in the context
  constructor(props) {
    super(props);
    this.state = {
      value: {
        // Crypto
        account: "0x0000000000000000000000000000000000000000",
        ethBalance: 0,
        tokenBalances:{},
        ethUSD:0,
        tokenUSD:{},
        networkSelected:4,
        // Fiat
        ewallet:"ewallet_804007caaf988cd1eb25a7dc3f70ee9d",
        clabe:"032180000118359719",
        phone:"+52",
        fiatBalanceUSD: 0,
        fiatBalanceMXN: 0,
        // Others
        show:true,
        selected: 0,
      }
    }
    reactAutobind(this);
  }

  // Method to update manually the context state, this method isn't used in this example

  setValue = (value, then = () => { }) => {
    this.setState({
      value: {
        ...this.state.value,
        ...value,
      }
    }, () => then())
  }

  render() {
    const { children } = this.props
    const { value } = this.state
    // Fill this object with the methods you want to pass down to the context
    const { setValue } = this

    return (
      <ContextModule.Provider
        // Provide all the methods and values defined above
        value={{
          value,
          setValue
        }}
      >
        {children}
      </ContextModule.Provider>
    )
  }
}

// Dont Change anything below this line

export { ContextProvider }
export const ContextConsumer = ContextModule.Consumer
export default ContextModule
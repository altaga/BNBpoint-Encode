// Basic Imports
import React, { Component } from 'react';
import { Text, View, Pressable, Image, Dimensions, Animated, ScrollView } from 'react-native';
// Crypto
import Web3 from 'web3';
// Contracts
import { abiERC20 } from "../contracts/erc20"
import { abiFeeds } from "../contracts/priceFeedContract"
// Components Local
import Footer from './components/footer';
import Header from './components/header';
// Utils 
import reactAutobind from 'react-autobind';
// Utils Local
import ContextModule from '../utils/contextModule';
// Styles
import GlobalStyles from '../styles/styles';
// Assets

import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

import Chart from './cryptoAccountComponents/chart';

import { contentColor, native, NODE_ENV_NETWORK_NAME, NODE_ENV_NETWORK_RCP, NODE_ENV_CHAINLINK_FEED_CONTRACT, NODE_ENV_DATA_FEEDS_RCP, tokens, tokensContracts, tokensIcons, headerColor, nativeIcon, geckoTokens, geckoNative, colors, colorTokens } from "../../env"

async function getUSD(array) {
    return new Promise((resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${array.toString()}&vs_currencies=usd`, requestOptions)
            .then(response => response.text())
            .then(result => resolve(JSON.parse(result)))
            .catch(error => console.log('error', error));
    })
}

function epsilonRound(num, zeros = 4) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) / Math.pow(10, zeros)
}

class CryptoAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            modal: false
        };
        reactAutobind(this)
        this.web3 = null
        this.web3Feeds = new Web3(NODE_ENV_DATA_FEEDS_RCP)
        this.contract = new this.web3Feeds.eth.Contract(abiFeeds, NODE_ENV_CHAINLINK_FEED_CONTRACT)
        this.mount = true
    }

    static contextType = ContextModule;

    async getBalanceToken(address, tokenAddress) {
        return new Promise(async (resolve, reject) => {
            const contract = new this.web3.eth.Contract(abiERC20, tokenAddress)
            let res = await contract.methods.balanceOf(address).call()
            let decimals = await contract.methods.decimals().call()
            resolve(res / (Math.pow(10, decimals)))
        })
    }

    async componentDidMount() {
        this.web3 = new Web3(NODE_ENV_NETWORK_RCP[this.context.value.networkSelected])
        this.props.navigation.addListener('focus', async () => {
            this.mount = true
            this.mount && this.setState({
                modal: false
            })
            // Native
            this.web3.eth.getBalance(this.context.value.account).then((res) => {
                this.context.setValue({
                    ethBalance: this.web3.utils.fromWei(res, 'ether'),
                })
            })
            // Tokens
            tokensContracts[this.context.value.networkSelected].forEach((item, index) => {
                this.getBalanceToken(this.context.value.account, item).then((resp) => {
                    let json = {}
                    json[tokens[index]] = resp
                    this.context.setValue({
                        tokenBalances: {
                            ...this.context.value.tokenBalances,
                            ...json
                        }
                    })
                })
            })
            let array = [geckoNative[this.context.value.networkSelected]].concat(geckoTokens)
            let results = await getUSD(array)
            let ethUSD = results[geckoNative[this.context.value.networkSelected]].usd
            let tokenUSD = {}
            geckoTokens.map((item, index) => tokenUSD[tokens[index]] = results[item].usd)
            this.context.setValue({
                ethUSD,
                tokenUSD
            })
        })
        this.props.navigation.addListener('blur', () => {
            this.mount = false
            this.setState({
                modal: false
            })
        })
    }

    componentWillUnmount() {
        this.mount = false
    }

    render() {
        return (
            <>
                <View style={GlobalStyles.container}>
                    <Header />
                    <View style={{ position: "absolute", top: 9, left: 18 }}>
                        <Pressable style={{ alignSelf: "center" }} onPress={() => this.props.navigation.navigate('CryptoTransactions')}>
                            <IconMI name="receipt-long" size={24} color={headerColor[this.context.value.networkSelected]} />
                        </Pressable>
                        <Text style={{ color: "white" }}>
                            Transactions
                        </Text>
                    </View>
                    <View style={{ position: "absolute", top: 9, right: 18 }}>
                        <Pressable style={{ alignSelf: "center" }} onPress={() => this.props.navigation.navigate('CryptoCashOut')}>
                            <IconMCI name="cash-fast" size={24} color={headerColor[this.context.value.networkSelected]} />
                        </Pressable>
                        <Text style={{ color: "white" }}>
                            Withdraw
                        </Text>
                    </View>
                    <View style={[GlobalStyles.main, { flexDirection: "column", alignItems: "center", paddingTop: 10 }]}>
                        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
                            <View style={{ borderBottomWidth: 0.5, borderColor: "black", width: "100%" }}>
                                <Pressable onPress={() =>
                                    this.context.setValue({
                                        show: !this.context.value.show
                                    })
                                }>
                                    <Text style={{ textAlign: "center", color: "white", fontSize: 20, }}>
                                        {NODE_ENV_NETWORK_NAME[this.context.value.networkSelected]} Address
                                        {"\n"}
                                        {
                                            this.context.value.account.substring(0, 7)
                                        }
                                        ...
                                        {
                                            this.context.value.account.substring(35, 42)
                                        }
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ backgroundColor: contentColor[this.context.value.networkSelected], height: 2, width: "90%", marginVertical: 10 }} />
                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
                                Balance
                            </Text>
                            <Pressable onPress={() =>
                                this.context.setValue({
                                    show: !this.context.value.show
                                })
                            }>
                                <Text style={{ fontSize: 30, color: 'white' }}>
                                    {"$ "}
                                    {
                                        this.context.value.show ? epsilonRound(
                                            this.context.value.ethBalance * this.context.value.ethUSD +
                                            tokens.map((item) => this.context.value.tokenBalances[item] ?? 0 * this.context.value.tokenUSD[item] ?? 0).reduce((partialSum, a) => partialSum + a, 0)
                                            , 2
                                        ) : "***"
                                    }
                                    {" USD"}
                                </Text>
                            </Pressable>
                        </View>
                        <View style={{ backgroundColor: contentColor[this.context.value.networkSelected], height: 2, width: "90%", marginVertical: 10 }} />
                        <View style={{ height: "15%" }}>
                            <ScrollView persistentScrollbar>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ width: "33.33%" }}>
                                        {
                                            this.context.value.show ? <Image source={nativeIcon[this.context.value.networkSelected]} style={{ width: 20, height: 20, alignSelf: 'center' }} /> : <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>{"***"} </Text>
                                        }
                                    </View>
                                    <Text style={{ fontSize: 20, color: 'white', width: "33.33%", textAlign: "center" }}>
                                        {this.context.value.show ? native[this.context.value.networkSelected] : "***"}
                                    </Text>
                                    <Text style={{ fontSize: 20, color: 'white', width: "33.33%", textAlign: "center" }} >
                                        {
                                            " "
                                        }
                                        {
                                            this.context.value.show ? epsilonRound(parseFloat(this.context.value.ethBalance)) : "***"
                                        }
                                        {
                                            " "
                                        }
                                    </Text>
                                </View>
                                {
                                    tokens.map((item, index) =>
                                        epsilonRound(this.context.value.tokenBalances[item], 6) > 0 &&
                                        <React.Fragment key={index + "Value"}>
                                            <View style={{ backgroundColor: "#78d64b55", height: 0.5, width: Dimensions.get("window").width * 0.9, marginVertical: 8, alignSelf: "center" }} />
                                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                                <View style={{ width: "33.33%" }}>
                                                    {
                                                        this.context.value.show ? <Image source={tokensIcons[index]} style={{ width: 20, height: 20, alignSelf: 'center' }} /> : <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>{"***"} </Text>
                                                    }
                                                </View>
                                                <Text style={{ fontSize: 20, color: 'white', width: "33.33%", textAlign: "center" }}>
                                                    {this.context.value.show ? item : "***"}
                                                </Text>
                                                <Text style={{ fontSize: 20, color: 'white', width: "33.33%", textAlign: "center" }} >
                                                    {
                                                        " "
                                                    }
                                                    {
                                                        this.context.value.show ? epsilonRound(this.context.value.tokenBalances[item], 2) : "***"
                                                    }
                                                    {
                                                        " "
                                                    }
                                                </Text>
                                            </View>
                                        </React.Fragment>
                                    )
                                }
                            </ScrollView>
                        </View>
                        <View style={{ backgroundColor: contentColor[this.context.value.networkSelected], height: 2, width: "90%", marginVertical: 10 }} />
                        <Chart size={180} data={[this.context.value.ethBalance * this.context.value.ethUSD].concat(tokens.map((item) => this.context.value.tokenBalances[item] ?? 0 * this.context.value.tokenUSD[item] ?? 0))} dataColors={[colors[this.context.value.networkSelected]].concat(colorTokens)} dataLabels={[native[this.context.value.networkSelected]].concat(tokens)} dataMultipliers={[1/this.context.value.ethUSD , 1, 1]} show={this.context.value.show} round={[4, 2, 4]} />
                    </View>
                    <Footer navigation={this.props.navigation} />
                </View>
            </>
        );
    }
}

export default CryptoAccount;
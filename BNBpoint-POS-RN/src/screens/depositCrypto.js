// Basic Imports
import React, { Component } from 'react';
import { Text, View, Pressable, Dimensions, Linking } from 'react-native';
// Components
import QRCode from 'react-native-qrcode-svg';
// Components Local
import Header from './components/header';
import Footer from './components/footer';
// Utils 
import reactAutobind from 'react-autobind';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import NfcManager, { Ndef, NfcEvents } from 'react-native-nfc-manager';
// Utils Local
import ContextModule from '../utils/contextModule';
import IotReciever from "../utils/iot-reciever-aws"
// Assets
import Icon from 'react-native-vector-icons/Feather';
import IconMC from 'react-native-vector-icons/MaterialIcons';
import { logo } from "../assets/logo"
// Styles
import GlobalStyles from '../styles/styles';

import { contentColor, native, NODE_ENV_NETWORK_NAME, NODE_ENV_API_APIKEY, NODE_ENV_API_EXPLORER, NODE_ENV_EXPLORER, headerColor, NODE_ENV_NETWORK_APPNAME } from "../../env"

function epsilonRound(num, zeros = 4) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) / Math.pow(10, zeros)
}

class DepositCrypto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memory: 0,
            qr: null,
            signature: "",
            check: false,
            printData: "",
            amount: 0,
            signature: "",
            publish: {
                message: '',
                topic: '',
            },
            token: null
        };
        reactAutobind(this)
        this.interval = null
        this.mount = true
        this.flag = true
        this.svg = null
        this.NfcManager = NfcManager
    }

    static contextType = ContextModule;

    async getDataURL() {
        return new Promise(async (resolve, reject) => {
            this.svg.toDataURL(async (data) => {
                this.setState({
                    printData: "data:image/png;base64," + data
                }, () => resolve("ok"))
            });
        })
    }

    setupNFC() {
        this.NfcManager.start()
        this.NfcManager.setEventListener(NfcEvents.DiscoverTag, this.NFCreadData);
        this.NfcManager.registerTagEvent()
    }

    NFCreadData(data) {
        console.log(data)
        let decoded = Ndef.text.decodePayload(data.ndefMessage[0].payload)
        console.log(decoded)
        if (decoded.length === 42) {
            this.mount && this.setState({
                publish: {
                    message: `{ "token": "${this.context.value.account}" }`,
                    topic: `/${NODE_ENV_NETWORK_APPNAME}/WalletConnect/${decoded}`,
                }
            })
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.interval = null
            this.mount = true
            this.flag = true
            this.svg = null
            this.setState({
                token:native[this.context.value.networkSelected]
            })
            this.setupNFC()
            this.interval = setInterval(() => {
                if (this.flag) {
                    this.flag = false
                    var myHeaders = new Headers();
                    const requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };
                    fetch(`${NODE_ENV_API_EXPLORER[this.context.value.networkSelected]}?module=account&action=txlist&address=${this.context.value.account}&startblock=0&endblock=99999999&sort=desc&page=1&apikey=${NODE_ENV_API_APIKEY[this.context.value.networkSelected]}`, requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            fetch(`${NODE_ENV_API_EXPLORER[this.context.value.networkSelected]}?module=account&action=tokentx&address=${this.context.value.account}&startblock=0&endblock=99999999&sort=desc&page=1&apikey=${NODE_ENV_API_APIKEY[this.context.value.networkSelected]}`, requestOptions)
                                .then(responses => responses.text())
                                .then(results => {
                                    let temp = JSON.parse(result).result.concat(JSON.parse(results).result).sort((a, b) => a.timeStamp < b.timeStamp)
                                    let len = temp.length
                                    console.log(temp.length)
                                    if (this.state.memory !== 0 && this.state.memory < len) {
                                        console.log(temp[0])
                                        this.mount && this.setState({
                                            memory: len,
                                            check: true,
                                            signature: temp[0].hash,
                                            amount: temp[0].tokenSymbol !== undefined ? epsilonRound(temp[0].value / temp[0].tokenDecimal) : epsilonRound(temp[0].value / 1000000000000000000, 8),
                                            token: temp[0].tokenSymbol ?? native[this.context.value.networkSelected]
                                        }, () => {
                                            clearInterval(this.interval)
                                        })
                                    }
                                    else {
                                        this.mount && this.setState({
                                            memory: len
                                        }, () => {
                                            this.flag = true
                                        })
                                    }
                                })
                                .catch(error => console.log('error', error));
                        })
                        .catch(error => console.log('error', error));
                }
            }, 5000);
        })
        this.props.navigation.addListener('blur', () => {
            this.setState({
                memory: 0,
                qr: null,
                signature: "",
                check: false,
                printData: "",
                amount: 0,
                signature: "",
                publish: {
                    message: '',
                    topic: '',
                }
            })
            this.mount = false
            clearInterval(this.interval)
            this.NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
            this.NfcManager.unregisterTagEvent();
        })
    }

    componentWillUnmount() {
        this.mount = false
        clearInterval(this.interval)
    }

    callBackIoT = (data) => {
        console.log(data)
    }

    render() {
        return (
            <>
                <View style={GlobalStyles.container}>
                    <Header />
                    {
                        <View style={{ position: "absolute", top: 9, left: 18 }}>
                            <Pressable onPress={() => this.props.navigation.navigate('Payments')}>
                                <IconMC name="arrow-back-ios" size={36} color={headerColor[this.context.value.networkSelected]} />
                            </Pressable>
                        </View>
                    }
                    {
                        !this.state.check &&
                        <View style={{ position: "absolute", top: 18, right: 18 }}>
                            <IotReciever publish={this.state.publish} sub_topics={[]} callback={this.callBackIoT} callbackPublish={() => this.mount && this.setState({ publish: { message: '', topic: '', } })} />
                        </View>
                    }
                    {
                        !this.state.check ?
                            <View style={[GlobalStyles.mainSub, { flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }]}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 22, width: "80%" }}>
                                    {NODE_ENV_NETWORK_NAME[this.context.value.networkSelected]} Address:
                                    {"\n"}
                                    {
                                        this.context.value.account.substring(0, 21)
                                    }
                                    {"\n"}
                                    {
                                        this.context.value.account.substring(21, 42)
                                    }
                                </Text>
                                <View style={{ borderColor: contentColor, borderWidth: 2 }}>
                                    <QRCode
                                        value={this.context.value.account}
                                        size={280}
                                        quietZone={10}
                                        ecl="H"
                                    />
                                </View>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 28, width: "80%" }}>
                                    Scan with your{"\n"} mobile wallet
                                </Text>
                            </View>
                            :
                            <View style={[GlobalStyles.mainSub, { flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }]}>
                                <Icon name="check-circle" size={160} color={contentColor[this.context.value.networkSelected]} />
                                <Text style={{
                                    textShadowRadius: 1,
                                    fontSize: 28, fontWeight: "bold", color: "white"
                                }}>
                                    Completed
                                </Text>
                                <Pressable style={{ marginVertical: 30 }} onPress={() => Linking.openURL(`${NODE_ENV_EXPLORER[this.context.value.networkSelected]}tx/` + this.state.signature)}>
                                    <Text style={{
                                        fontSize: 24, fontWeight: "bold", color: "white", textAlign: "center"
                                    }}>
                                        View on Explorer
                                    </Text>
                                </Pressable>
                                <Pressable style={[GlobalStyles.button,{backgroundColor:contentColor[this.context.value.networkSelected]}]} onPress={async () => {
                                    await this.getDataURL()
                                    const results = await RNHTMLtoPDF.convert({
                                        html: (`
                                    <div style="text-align: center;">
                                    <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                    <img src='${logo}' width="450px"></img>
                                        <h1 style="font-size: 3rem;">--------- Original Reciept ---------</h1>
                                        <h1 style="font-size: 3rem;">Date: ${new Date().toLocaleDateString()}</h1>
                                        <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                        <h1 style="font-size: 3rem;">Direct Transfer</h1>
                                        <h1 style="font-size: 3rem;">Network: ${NODE_ENV_NETWORK_NAME[this.context.value.networkSelected]}</h1>
                                        <h1 style="font-size: 3rem;">Amount: ${this.state.amount.toString()} ${this.state.token + " "}</h1>
                                        <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                        <img src='${this.state.printData}'></img>
                                    </div>
                                    `),
                                        fileName: 'print',
                                        base64: true,
                                    })
                                    await RNPrint.print({ filePath: results.filePath })
                                }}>
                                    <Text style={[GlobalStyles.buttonText]}>
                                        Print Receipt
                                    </Text>
                                </Pressable>
                                <Pressable style={[GlobalStyles.button,{backgroundColor:contentColor[this.context.value.networkSelected]}]} onPress={() => {
                                    this.props.navigation.navigate('Payments')
                                }}>
                                    <Text style={[GlobalStyles.buttonText]}>
                                        Done
                                    </Text>
                                </Pressable>
                            </View>
                    }
                </View>
                <View style={{ marginTop: Dimensions.get("window").height }}>
                    <QRCode
                        value={`${NODE_ENV_EXPLORER[this.context.value.networkSelected]}tx/` + this.state.signature}
                        size={Dimensions.get("window").width * 0.7}
                        ecl="L"
                        getRef={(c) => (this.svg = c)}
                    />
                </View>
            </>
        );
    }
}

export default DepositCrypto;
// Basic Imports
import React, {Component} from 'react';
import {
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Linking,
} from 'react-native';
// Contracts
import {abiERC20} from '../contracts/erc20';
// Crypto
import Web3 from 'web3';
import WalletConnect from '@walletconnect/client';
// Components
import {Picker} from 'react-native-form-component';
import QRCode from 'react-native-qrcode-svg';
// Components Local
import Footer from './components/footer';
import Header from './components/header';
// Utils
import NfcManager, {Ndef, NfcEvents} from 'react-native-nfc-manager';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import reactAutobind from 'react-autobind';
// Utils Local
import IotReciever from '../utils/iot-reciever-aws';
import ContextModule from '../utils/contextModule';
// Assets
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Feather';
import IconMCI from 'react-native-vector-icons/MaterialIcons';
import {logo} from '../assets/logo';
// Styles
import GlobalStyles from '../styles/styles';

import {
  NODE_ENV_NETWORK_APPNAME,
  contentColor,
  native,
  NODE_ENV_NETWORK_NAME,
  NODE_ENV_EXPLORER,
  NODE_ENV_NETWORK_RCP,
  tokens,
  tokensContracts,
  headerColor,
  NODE_ENV_NETWORK_ID,
  NODE_ENV_NETWORK_CONNEXT_CONTRACT,
  NODE_ENV_NETWORK_CONNEXT_ID,
} from '../../env';
import {abiConnext} from '../contracts/connext';

const networks = NODE_ENV_NETWORK_NAME.map((item, index) => ({
  name: item,
  rpc: NODE_ENV_NETWORK_RCP[index],
}));

async function getRelayerFee(chainIn, chainOut) {
  return new Promise((resolve, reject) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      chainIn,
      chainOut,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://4a35-54-160-68-187.ngrok-free.app/get-gas-fee',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => resolve(result.fees))
      .catch(error => console.log('error', error));
  });
}

class MyWalletConnect extends Component {
  constructor(props) {
    super(props);
    // 0 selection as Seed value
    this.state = {
      qr: null,
      account: '',
      stage: 0,
      network: {
        label: NODE_ENV_NETWORK_NAME[0],
        value: NODE_ENV_NETWORK_RCP[0],
        networkSelected: 0,
      },
      token: {
        label: native[0],
        value: '',
      },
      tokenList: [
        {
          label: native[0],
          value: '',
        },
      ].concat(
        tokens.map((item, index) => ({
          label: item,
          value: tokensContracts[0][index],
        })),
      ),
      place: '',
      articles: '',
      amount: 0,
      signature: '',
      publish: {
        message: '',
        topic: '',
      },
      mount: true,
    };
    reactAutobind(this);
    this.mount = true;
    this.NfcManager = NfcManager;
    this.svg = null;
    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: {
        description: 'Payment',
        url: `https://${NODE_ENV_NETWORK_APPNAME}.com`,
        icons: [
          'https://general-bucket-android.s3.amazonaws.com/miniLogoBNB2.png',
        ], // Pending to REPO
        name: `${NODE_ENV_NETWORK_APPNAME}\nPOS System`,
      },
    });
  }

  static contextType = ContextModule;

  async getDataURL() {
    return new Promise(async (resolve, reject) => {
      this.svg.toDataURL(async data => {
        this.mount &&
          this.setState(
            {
              printData: 'data:image/png;base64,' + data,
            },
            () => resolve('ok'),
          );
      });
    });
  }

  callBackIoT = data => {
    console.log(data);
  };

  async transfer(amount, from, to) {
    const web3Provider = new Web3(this.state.network.value);
    let transaction = {
      from,
      to,
      data: '0x',
      value: web3Provider.utils.toHex(
        web3Provider.utils.toWei(amount.toString(), 'ether'),
      ),
    };
    console.log(transaction);
    this.connector
      .sendTransaction(transaction)
      .then(result => {
        this.mount &&
          this.setState(
            {
              signature: result,
              stage: 3,
            },
            () => {
              this.connector.killSession();
            },
          );
      })
      .catch(error => {
        console.log('Refreshing QR');
        this.connector.killSession().then(() => {
          this.connector
            .createSession({
              chainId: NODE_ENV_NETWORK_ID[this.context.value.networkSelected],
            })
            .then(() => {
              this.mount &&
                this.setState({
                  qr: this.connector.uri,
                  stage: 1,
                });
            });
        });
      });
  }

  async transferToken(amount, from, to, tokenAddress) {
    console.log('transfer Token');
    const web3Provider = new Web3(this.state.network.value);
    const contract = new web3Provider.eth.Contract(abiERC20, tokenAddress, {
      from,
    });
    let decimals = await contract.methods.decimals().call();
    let transaction = {
      to: tokenAddress,
      from,
      data: contract.methods
        .transfer(to, web3Provider.utils.toHex(amount * Math.pow(10, decimals)))
        .encodeABI(),
    };
    console.log(transaction);
    this.connector
      .sendTransaction(transaction)
      .then(result => {
        this.mount &&
          this.setState(
            {
              signature: result,
              stage: 3,
            },
            () => {
              this.connector.killSession();
            },
          );
      })
      .catch(error => {
        console.log('Refreshing QR');
        this.connector.killSession().then(() => {
          this.connector
            .createSession({
              chainId: NODE_ENV_NETWORK_ID[this.context.value.networkSelected],
            })
            .then(() => {
              this.mount &&
                this.setState({
                  qr: this.connector.uri,
                  stage: 1,
                });
            });
        });
      });
  }

  async xTransferToken(amount, from, to, tokenAddress) {
    const web3Provider = new Web3(this.state.network.value);
    const contractERC20 = new web3Provider.eth.Contract(
      abiERC20,
      tokenAddress,
      {
        from,
      },
    );
    let decimals = await contractERC20.methods.decimals().call();
    console.log(decimals);
    let transaction = {
      to: tokenAddress,
      from,
      data: contractERC20.methods
        .approve(
          NODE_ENV_NETWORK_CONNEXT_CONTRACT[this.state.network.networkSelected],
          web3Provider.utils.toHex(amount * Math.pow(10, decimals)),
        )
        .encodeABI(),
    };
    console.log(transaction);
    this.connector.sendTransaction(transaction).then(async result1 => {
      let once = true;
      const interval = setInterval(() => {
        if (once) {
          once = false;
          web3Provider.eth.getTransactionReceipt(result1, async (err, rec) => {
            if (rec) {
              clearInterval(interval);
              console.log(rec)
              const contractConnext = new web3Provider.eth.Contract(
                abiConnext,
                NODE_ENV_NETWORK_CONNEXT_CONTRACT[
                  this.state.network.networkSelected
                ],
                {
                  from,
                },
              );
              console.log(contractConnext)
              const relayerFee = await getRelayerFee(
                NODE_ENV_NETWORK_CONNEXT_ID[this.state.network.networkSelected],
                NODE_ENV_NETWORK_CONNEXT_ID[this.context.value.networkSelected],
              );
              console.log(relayerFee)
              transaction = {
                to: NODE_ENV_NETWORK_CONNEXT_CONTRACT[
                  this.state.network.networkSelected
                ],
                from,
                value: web3Provider.utils.toHex(relayerFee),
                data: contractConnext.methods
                  .xcall(
                    NODE_ENV_NETWORK_CONNEXT_ID[
                      this.context.value.networkSelected
                    ],
                    to,
                    tokenAddress,
                    from,
                    web3Provider.utils.toHex(amount * Math.pow(10, decimals)),
                    30,
                    '0x',
                  )
                  .encodeABI(),
              };
              console.log(transaction)
              this.connector
                .sendTransaction(transaction)
                .then(async result2 => {
                  this.mount &&
                    this.setState(
                      {
                        signature: result2,
                        stage: 3,
                      },
                      () => {
                        this.connector.killSession();
                      },
                    );
                });
            } else {
              console.log('.');
              once = true
            }
          });
        }
      }, 1000);
    });
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.mount = true;
      // Setup Selected Network on Context
      this.setState({
        mount: true,
        network: {
          label: NODE_ENV_NETWORK_NAME[this.context.value.networkSelected],
          value: NODE_ENV_NETWORK_RCP[this.context.value.networkSelected],
          networkSelected: this.context.value.networkSelected,
        },
        token: {
          label: native[this.context.value.networkSelected],
          value: '',
        },
        tokenList: [
          {
            label: native[this.context.value.networkSelected],
            value: '',
          },
        ].concat(
          tokens.map((item, index) => ({
            label: item,
            value: tokensContracts[this.context.value.networkSelected][index],
          })),
        ),
      });
      this.setupNFC();
      this.connector.on('connect', async (error, payload) => {
        if (error) {
          console.log('Error Connect');
          throw error;
        }
        this.NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        this.NfcManager.unregisterTagEvent();
        // Get provided accounts and chainId
        const {accounts, chainId} = payload.params[0];
        console.log({accounts, chainId});
        this.mount &&
          this.setState(
            {
              account: accounts[0],
              stage: 2,
            },
            () => {
              if (
                this.context.value.networkSelected ===
                this.state.network.networkSelected
              ) {
                if (
                  this.state.token.label ===
                  native[this.context.value.networkSelected]
                ) {
                  this.transfer(
                    this.state.amount,
                    this.state.account,
                    this.context.value.account,
                  );
                } else {
                  this.transferToken(
                    this.state.amount,
                    this.state.account,
                    this.context.value.account,
                    this.state.token.value,
                  );
                }
              } else {
                this.xTransferToken(
                  this.state.amount,
                  this.state.account,
                  this.context.value.account,
                  this.state.token.value,
                );
              }
            },
          );
      });
      this.connector.on('session_update', (error, payload) => {
        if (error) {
          console.log('Error Session Update');
          throw error;
        }
        // Get updated accounts and chainId
        const {accounts, chainId} = payload.params[0];
        console.log({accounts, chainId});
      });
      this.connector.on('session_request', (error, payload) => {
        if (error) {
          console.log('Error Session Request');
          throw error;
        }
        console.log(payload);
      });
      this.connector.on('call_request', (error, payload) => {
        if (error) {
          console.log('Error Call Request');
          throw error;
        }
        // Get updated accounts and chainId
        console.log(payload);
      });
      this.connector.on('wc_sessionRequest', (error, payload) => {
        if (error) {
          console.log('Error WC Session Request');
          throw error;
        }
        // Get updated accounts and chainId
        console.log(payload);
      });
      this.connector.on('wc_sessionUpdate', (error, payload) => {
        if (error) {
          console.log('Error WC Session Update');
          throw error;
        }
        // Get updated accounts and chainId
        console.log(payload);
      });
      this.connector.on('disconnect', (error, payload) => {
        if (error) {
          console.log('Error Disconnect');
          throw error;
        }
        // Refresh
        if (
          !this.connector.connected &&
          payload.params[0].message === 'Session Rejected'
        ) {
          console.log('Refreshing QR');
          this.connector
            .createSession({
              chainId: NODE_ENV_NETWORK_ID[this.state.network.networkSelected],
            })
            .then(() => {
              this.mount &&
                this.setState({
                  qr: this.connector.uri,
                });
            });
        }
      });
    });
    this.props.navigation.addListener('blur', () => {
      this.connector.killSession();
      this.setState({
        mount: false,
        qr: null,
        account: '',
        stage: 0,
        network: {
          label: NODE_ENV_NETWORK_NAME[this.context.value.networkSelected],
          value: NODE_ENV_NETWORK_RCP[this.context.value.networkSelected],
          networkSelected: this.context.value.networkSelected,
        },
        token: {
          label: native[this.context.value.networkSelected],
          value: '',
        },
        tokenList: [
          {
            label: native[this.context.value.networkSelected],
            value: '',
          },
        ].concat(
          tokens.map((item, index) => ({
            label: item,
            value: tokensContracts[this.context.value.networkSelected][index],
          })),
        ),
        place: '',
        articles: '',
        amount: 0,
        signature: '',
        publish: {
          message: '',
          topic: '',
        },
      });
      this.mount = false;
      this.NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      this.NfcManager.unregisterTagEvent();
    });
  }

  setupNFC() {
    this.NfcManager.start();
    this.NfcManager.setEventListener(NfcEvents.DiscoverTag, this.NFCreadData);
    this.NfcManager.registerTagEvent();
  }

  NFCreadData(data) {
    console.log(data);
    let decoded = Ndef.text.decodePayload(data.ndefMessage[0].payload);
    if (decoded.length === 42) {
      this.mount &&
        this.setState({
          publish: {
            message: `{ "token": "${this.state.qr}" }`,
            topic: `/${NODE_ENV_NETWORK_APPNAME}/WalletConnect/${decoded}`,
          },
        });
    }
  }

  componentWillUnmount() {
    this.NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    this.NfcManager.unregisterTagEvent();
    this.connector.killSession();
  }

  render() {
    return (
      <>
        <View style={GlobalStyles.container}>
          <Header />
          {
            <View style={{position: 'absolute', top: 9, left: 18}}>
              <Pressable
                onPress={() => this.props.navigation.navigate('Payments')}>
                <IconMCI
                  name="arrow-back-ios"
                  size={36}
                  color={headerColor[this.context.value.networkSelected]}
                />
              </Pressable>
            </View>
          }
          {this.state.stage === 1 && this.state.mount && (
            <View style={{position: 'absolute', top: 18, right: 18}}>
              <IotReciever
                publish={this.state.publish}
                sub_topics={[]}
                callback={this.callBackIoT}
                callbackPublish={() =>
                  this.mount &&
                  this.setState({publish: {message: '', topic: ''}})
                }
              />
            </View>
          )}
          {this.state.stage === 0 && (
            <ScrollView style={[GlobalStyles.mainSub]}>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  To Network
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    paddingTop: 10,
                  }}>
                  {NODE_ENV_NETWORK_NAME[this.context.value.networkSelected]}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                <Picker
                  isRequired
                  buttonStyle={{
                    fontSize: 28,
                    textAlign: 'center',
                    borderWidth: 1,
                    borderColor: 'black',
                    justifyContent: 'center',
                  }}
                  itemLabelStyle={[{fontSize: 24, textAlign: 'center'}]}
                  labelStyle={[
                    {fontSize: 28, textAlign: 'center', color: 'white'},
                  ]}
                  selectedValueStyle={[{fontSize: 28, textAlign: 'center'}]}
                  items={networks.map((item, index) => ({
                    label: item.name,
                    value: item.rpc,
                    networkSelected: index,
                  }))}
                  label="From Network"
                  selectedValue={this.state.network.value}
                  onSelection={item => {
                    if (
                      item.networkSelected ===
                      this.context.value.networkSelected
                    ) {
                      this.mount &&
                        this.setState({
                          network: item,
                          tokenList: [
                            {
                              label: native[item.networkSelected],
                              value: '',
                            },
                          ].concat(
                            tokens.map((items, index) => ({
                              label: items,
                              value:
                                tokensContracts[item.networkSelected][index],
                            })),
                          ),
                        });
                    } else {
                      this.mount &&
                        this.setState({
                          network: item,
                          tokenList: tokens.map((items, index) => ({
                            label: items,
                            value: tokensContracts[item.networkSelected][index],
                          })),
                        });
                    }
                  }}
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                <Picker
                  isRequired
                  buttonStyle={{
                    fontSize: 28,
                    textAlign: 'center',
                    borderWidth: 1,
                    borderColor: 'black',
                    justifyContent: 'center',
                  }}
                  itemLabelStyle={[{fontSize: 24, textAlign: 'center'}]}
                  labelStyle={[
                    {fontSize: 28, textAlign: 'center', color: 'white'},
                  ]}
                  selectedValueStyle={[{fontSize: 28, textAlign: 'center'}]}
                  items={this.state.tokenList}
                  label="Token"
                  selectedValue={this.state.token.value}
                  onSelection={item => {
                    this.mount &&
                      this.setState({
                        token: item,
                      });
                  }}
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  Amount
                </Text>
                <TextInput
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    borderRadius: 6,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  keyboardType="number-pad"
                  value={this.state.amount.toString()}
                  onChangeText={value =>
                    this.mount && this.setState({amount: value})
                  }
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  Place
                </Text>
                <TextInput
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    borderRadius: 6,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  keyboardType="default"
                  value={this.state.place}
                  onChangeText={value =>
                    this.mount && this.setState({place: value})
                  }
                />
              </View>
              <View
                style={{
                  width: '90%',
                  textAlign: 'center',
                  alignSelf: 'center',
                  paddingBottom: 30,
                }}>
                <Text
                  style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
                  Articles
                </Text>
                <TextInput
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    borderRadius: 6,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  keyboardType="default"
                  value={this.state.articles}
                  onChangeText={value =>
                    this.mount && this.setState({articles: value})
                  }
                />
              </View>
              <Pressable
                style={[
                  GlobalStyles.button,
                  {
                    backgroundColor:
                      contentColor[this.context.value.networkSelected],
                    alignSelf: 'center',
                    marginBottom: 20,
                  },
                ]}
                onPress={() => {
                  this.setupNFC();
                  this.connector
                    .createSession({
                      chainId:
                        NODE_ENV_NETWORK_ID[this.state.network.networkSelected],
                    })
                    .then(() => {
                      this.mount &&
                        this.setState({
                          qr: this.connector.uri,
                          stage: 1,
                        });
                    });
                }}>
                <Text style={[GlobalStyles.buttonText]}>Pay</Text>
              </Pressable>
            </ScrollView>
          )}
          {this.state.stage === 1 && (
            <View style={[GlobalStyles.mainSub, {}]}>
              {this.state.qr && (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[{fontSize: 24, color: 'white', marginVertical: 4}]}>
                    NFC or Scan
                  </Text>
                  <View
                    style={{
                      borderColor:
                        contentColor[this.context.value.networkSelected],
                      borderWidth: 2,
                    }}>
                    <QRCode
                      value={this.state.qr}
                      size={Dimensions.get('window').height / 1.8}
                      quietZone={10}
                      ecl="H"
                    />
                  </View>
                  {this.state.network.networkSelected !==
                    this.context.value.networkSelected && (
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor:
                          contentColor[this.context.value.networkSelected],
                        borderRadius: 10,
                        width: '90%',
                        marginTop: 10,
                      }}>
                      <Text
                        style={[
                          {fontSize: 24, color: 'white', marginVertical: 10},
                        ]}>
                        From Network:{' '}
                        {
                          NODE_ENV_NETWORK_NAME[
                            this.state.network.networkSelected
                          ]
                        }
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor:
                        contentColor[this.context.value.networkSelected],
                      borderRadius: 10,
                      width: '90%',
                      marginTop: 10,
                    }}>
                    <Text
                      style={[
                        {fontSize: 24, color: 'white', marginVertical: 10},
                      ]}>
                      Amount: {this.state.amount.toString()}{' '}
                      {this.state.token.label}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          {this.state.stage === 2 && (
            <View
              style={[
                GlobalStyles.mainSub,
                {
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                },
              ]}>
              <Icon
                name="wallet"
                size={128}
                color={contentColor[this.context.value.networkSelected]}
              />
              <Text
                style={{
                  textShadowRadius: 1,
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Wallet Connected
              </Text>
              <Text
                style={{
                  textShadowRadius: 1,
                  fontSize: 18,
                  color: '#AAA',
                  paddingTop: 10,
                  textAlign: 'center',
                  width: '60%',
                }}>
                Review and sign the transaction to complete...
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: contentColor[this.context.value.networkSelected],
                  borderRadius: 10,
                  width: '90%',
                  height: '30%',
                  marginTop: 20,
                }}>
                <Text style={[{fontSize: 24, color: 'white'}]}>
                  Amount: {this.state.amount.toString()}{' '}
                  {this.state.token.label}
                </Text>
                {this.state.place && (
                  <Text style={[{fontSize: 24, color: 'white'}]}>
                    Place: {this.state.place}
                  </Text>
                )}
                {this.state.articles && (
                  <Text style={[{fontSize: 24, color: 'white'}]}>
                    Articles: {this.state.articles}
                  </Text>
                )}
              </View>
            </View>
          )}
          {this.state.stage === 3 && (
            <View
              style={[
                GlobalStyles.mainSub,
                {
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                },
              ]}>
              <Icon2
                name="check-circle"
                size={160}
                color={contentColor[this.context.value.networkSelected]}
              />
              <Text
                style={{
                  textShadowRadius: 1,
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Completed
              </Text>
              <Pressable
                style={{marginVertical: 30}}
                onPress={() =>
                  Linking.openURL(
                    `${
                      NODE_ENV_EXPLORER[this.context.value.networkSelected]
                    }tx/` + this.state.signature,
                  )
                }>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  View on Explorer
                </Text>
              </Pressable>
              <Pressable
                style={[
                  GlobalStyles.button,
                  {
                    backgroundColor:
                      contentColor[this.context.value.networkSelected],
                    alignSelf: 'center',
                    marginBottom: 20,
                  },
                ]}
                onPress={async () => {
                  await this.getDataURL();
                  const results = await RNHTMLtoPDF.convert({
                    html: `
                                        <div style="text-align: center;">
                                        <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                        <img src='${logo}' width="450px"></img>
                                            <h1 style="font-size: 3rem;">--------- Original Reciept ---------</h1>
                                            <h1 style="font-size: 3rem;">Date: ${new Date().toLocaleDateString()}</h1>
                                            <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                            <h1 style="font-size: 3rem;">WalletConnect Transfer</h1>
                                            <h1 style="font-size: 3rem;">Network: ${
                                              NODE_ENV_NETWORK_NAME[
                                                this.context.value
                                                  .networkSelected
                                              ]
                                            }</h1>
                                            <h1 style="font-size: 3rem;">Amount: ${
                                              this.state.amount.toString() + ' '
                                            }${this.state.token.label}</h1>
                                            ${
                                              this.state.place &&
                                              `<h1 style="font-size: 3rem;">Place:${this.state.place}</h1>`
                                            }
                                            ${
                                              this.state.articles &&
                                              `<h1 style="font-size: 3rem;">Articles:${this.state.articles}</h1>`
                                            }
                                            <h1 style="font-size: 3rem;">------------------ • ------------------</h1>
                                            <img src='${
                                              this.state.printData
                                            }'></img>
                                        </div>
                                        `,
                    fileName: 'print',
                    base64: true,
                  });
                  await RNPrint.print({filePath: results.filePath});
                }}>
                <Text style={[GlobalStyles.buttonText]}>Print Receipt</Text>
              </Pressable>
              <Pressable
                style={[
                  GlobalStyles.button,
                  {
                    backgroundColor:
                      contentColor[this.context.value.networkSelected],
                    alignSelf: 'center',
                    marginBottom: 20,
                  },
                ]}
                onPress={() => {
                  this.props.navigation.navigate('Payments');
                }}>
                <Text style={[GlobalStyles.buttonText]}>Done</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={{position: 'absolute', bottom: -500}}>
          <QRCode
            value={
              NODE_ENV_EXPLORER[this.context.value.networkSelected] +
              'tx/' +
              this.state.signature
            }
            size={Dimensions.get('window').width * 0.7}
            ecl="L"
            getRef={c => (this.svg = c)}
          />
        </View>
      </>
    );
  }
}

export default MyWalletConnect;

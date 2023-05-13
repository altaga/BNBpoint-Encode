import React, { Component } from "react";
import { Image, View, Text, Pressable, Modal } from "react-native";
import logoETH from "../../assets/logoETHcrop.png";
import GlobalStyles from "../../styles/styles";
import { contentColor, headerColor, nativeIcon } from "../../../env";
import ContextModule from "../../utils/contextModule";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
    };
  }
  static contextType = ContextModule;

  async storeDefaultChain(value) {
    try {
      await AsyncStorage.setItem("chainId", JSON.stringify({ value }));
    } catch (e) {
      // saving error
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          {/*All views of Modal*/}
          <View
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#00000077",
            }}
          >
            <View
              style={{
                width: "70%",
                height: "40%",
                backgroundColor: "black",
                borderRadius: 10,
                borderColor: contentColor[this.context.value.networkSelected],
                borderWidth: 1,
              }}
            >
              <View style={{ margin: 10 }}>
                <Text
                  style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Select default chain
                </Text>
              </View>
              <View
                style={{
                  margin: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Pressable
                  onPress={async () => {
                    this.setState(
                      {
                        loading: true,
                      },
                      async () => {
                        await this.storeDefaultChain(0)
                        this.context.setValue(
                          {
                            networkSelected: 0,
                          },
                          () => {
                            this.setState({
                              visible: false,
                              loading: false,
                            });
                          }
                        );
                      }
                    );
                  }}
                  style={{
                    width: "33%",
                    height: 90,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={nativeIcon[0]}
                  />
                </Pressable>
                <Pressable
                  onPress={async () => {
                    this.setState(
                      {
                        loading: true,
                      },
                      async () => {
                        await this.storeDefaultChain(1)
                        this.context.setValue(
                          {
                            networkSelected: 1,
                          },
                          () => {
                            this.setState({
                              visible: false,
                              loading: false,
                            });
                          }
                        );
                      }
                    );
                  }}
                  style={{
                    width: "33%",
                    height: 90,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={nativeIcon[1]}
                  />
                </Pressable>
                <Pressable
                  onPress={async () => {
                    this.setState(
                      {
                        loading: true,
                      },
                      async () => {
                        await this.storeDefaultChain(2)
                        this.context.setValue(
                          {
                            networkSelected: 2,
                          },
                          () => {
                            this.setState({
                              visible: false,
                              loading: false,
                            });
                          }
                        );
                      }
                    );
                  }}
                  style={{
                    width: "33%",
                    height: 90,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={nativeIcon[2]}
                  />
                </Pressable>
                <Pressable
                  onPress={async () => {
                    this.setState(
                      {
                        loading: true,
                      },
                      async () => {
                        await this.storeDefaultChain(3)
                        this.context.setValue(
                          {
                            networkSelected: 3,
                          },
                          () => {
                            this.setState({
                              visible: false,
                              loading: false,
                            });
                          }
                        );
                      }
                    );
                  }}
                  style={{
                    width: "33%",
                    height: 90,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={nativeIcon[3]}
                  />
                </Pressable>
                <Pressable
                  onPress={async () => {
                    this.setState(
                      {
                        loading: true,
                      },
                      async () => {
                        await this.storeDefaultChain(4)
                        this.context.setValue(
                          {
                            networkSelected: 4,
                          },
                          () => {
                            this.setState({
                              visible: false,
                              loading: false,
                            });
                          }
                        );
                      }
                    );
                  }}
                  style={{
                    width: "33%",
                    height: 90,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={nativeIcon[4]}
                  />
                </Pressable>
                <Pressable
                  onPress={async () => {
                    this.setState(
                      {
                        loading: true,
                      },
                      async () => {
                        await this.storeDefaultChain(5)
                        this.context.setValue(
                          {
                            networkSelected: 5,
                          },
                          () => {
                            this.setState({
                              visible: false,
                              loading: false,
                            });
                          }
                        );
                      }
                    );
                  }}
                  style={{
                    width: "33%",
                    height: 90,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={nativeIcon[5]}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Pressable
          onPress={() => {
            if (this.props.navigation ? true : false) {
              this.setState({
                visible: true,
              });
            }
          }}
          style={[
            GlobalStyles.header,
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor:
                headerColor[this.context.value.networkSelected],
            },
          ]}
        >
          <Image
            source={logoETH}
            style={{ height: 343 / 10, width: 363 / 10 }}
          />
        </Pressable>
      </React.Fragment>
    );
  }
}

export default Header;

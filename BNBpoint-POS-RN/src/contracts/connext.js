export const abiConnext = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "acceptProposedRouterOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_local",
				"type": "address"
			}
		],
		"name": "addRouterLiquidity",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_local",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "addRouterLiquidityFor",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_transferId",
				"type": "bytes32"
			}
		],
		"name": "bumpTransfer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "uint32",
								"name": "originDomain",
								"type": "uint32"
							},
							{
								"internalType": "uint32",
								"name": "destinationDomain",
								"type": "uint32"
							},
							{
								"internalType": "uint32",
								"name": "canonicalDomain",
								"type": "uint32"
							},
							{
								"internalType": "address",
								"name": "to",
								"type": "address"
							},
							{
								"internalType": "address",
								"name": "delegate",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "receiveLocal",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "callData",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "slippage",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "originSender",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "bridgedAmt",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "normalizedIn",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "nonce",
								"type": "uint256"
							},
							{
								"internalType": "bytes32",
								"name": "canonicalId",
								"type": "bytes32"
							}
						],
						"internalType": "struct TransferInfo",
						"name": "params",
						"type": "tuple"
					},
					{
						"internalType": "address[]",
						"name": "routers",
						"type": "address[]"
					},
					{
						"internalType": "bytes[]",
						"name": "routerSignatures",
						"type": "bytes[]"
					},
					{
						"internalType": "address",
						"name": "sequencer",
						"type": "address"
					},
					{
						"internalType": "bytes",
						"name": "sequencerSignature",
						"type": "bytes"
					}
				],
				"internalType": "struct ExecuteArgs",
				"name": "_args",
				"type": "tuple"
			}
		],
		"name": "execute",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "transferId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "originDomain",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "destinationDomain",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "canonicalDomain",
						"type": "uint32"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "delegate",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "receiveLocal",
						"type": "bool"
					},
					{
						"internalType": "bytes",
						"name": "callData",
						"type": "bytes"
					},
					{
						"internalType": "uint256",
						"name": "slippage",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "originSender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "bridgedAmt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "normalizedIn",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "canonicalId",
						"type": "bytes32"
					}
				],
				"internalType": "struct TransferInfo",
				"name": "_params",
				"type": "tuple"
			}
		],
		"name": "forceReceiveLocal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "originDomain",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "destinationDomain",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "canonicalDomain",
						"type": "uint32"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "delegate",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "receiveLocal",
						"type": "bool"
					},
					{
						"internalType": "bytes",
						"name": "callData",
						"type": "bytes"
					},
					{
						"internalType": "uint256",
						"name": "slippage",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "originSender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "bridgedAmt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "normalizedIn",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "canonicalId",
						"type": "bytes32"
					}
				],
				"internalType": "struct TransferInfo",
				"name": "_params",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "_slippage",
				"type": "uint256"
			}
		],
		"name": "forceUpdateSlippage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			}
		],
		"name": "initializeRouter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_proposed",
				"type": "address"
			}
		],
		"name": "proposeRouterOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "domain",
						"type": "uint32"
					},
					{
						"internalType": "bytes32",
						"name": "id",
						"type": "bytes32"
					}
				],
				"internalType": "struct TokenId",
				"name": "_canonical",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "removeRouterLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "domain",
						"type": "uint32"
					},
					{
						"internalType": "bytes32",
						"name": "id",
						"type": "bytes32"
					}
				],
				"internalType": "struct TokenId",
				"name": "_canonical",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "removeRouterLiquidityFor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			}
		],
		"name": "setRouterRecipient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_destination",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_asset",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_delegate",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_slippage",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_callData",
				"type": "bytes"
			}
		],
		"name": "xcall",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_destination",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_asset",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_delegate",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_slippage",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_callData",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "_relayerFee",
				"type": "uint256"
			}
		],
		"name": "xcall",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_destination",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_asset",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_delegate",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_slippage",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_callData",
				"type": "bytes"
			}
		],
		"name": "xcallIntoLocal",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_adopted",
				"type": "address"
			}
		],
		"name": "adoptedToCanonical",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "domain",
						"type": "uint32"
					},
					{
						"internalType": "bytes32",
						"name": "id",
						"type": "bytes32"
					}
				],
				"internalType": "struct TokenId",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "domain",
						"type": "uint32"
					},
					{
						"internalType": "bytes32",
						"name": "id",
						"type": "bytes32"
					}
				],
				"internalType": "struct TokenId",
				"name": "_canonical",
				"type": "tuple"
			}
		],
		"name": "approvedAssets",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_sequencer",
				"type": "address"
			}
		],
		"name": "approvedSequencers",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "domain",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "getProposedRouterOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "getProposedRouterOwnerTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "getRouterApproval",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "getRouterApprovalForPortal",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "getRouterOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			}
		],
		"name": "getRouterRecipient",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LIQUIDITY_FEE_DENOMINATOR",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LIQUIDITY_FEE_NUMERATOR",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxRoutersPerTransfer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nonce",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_domain",
				"type": "uint32"
			}
		],
		"name": "remote",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_transferId",
				"type": "bytes32"
			}
		],
		"name": "routedTransfers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_asset",
				"type": "address"
			}
		],
		"name": "routerBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_transferId",
				"type": "bytes32"
			}
		],
		"name": "transferStatus",
		"outputs": [
			{
				"internalType": "enum DestinationTransferStatus",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "xAppConnectionManager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
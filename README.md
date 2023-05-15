# BNBpoint

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [<img src="https://img.shields.io/badge/View-Video-red">](pending)

<img src="https://i.ibb.co/rmyZzXt/logoETH.png" width="50%">

<br>

Welcome, this is our project for BNB Chain Zero2Hero Builder Series Hackathon.

# IMPORTANT!

## Application:

Main App APK: [LINK](./BNBpoint-Wallet-APK/app-release.apk)

POS App APK: [LINK](./BNBpoint-POS-APK/app-release.apk)

## Here is our main demo video:

[![Demo](https://i.ibb.co/g4W3ypx/image.png)](pending)

# Introduction and Problem

Almost 4 years ago Vitálik Buterin, co founder of Ethereum posted in twitter this message:

<img src="https://i.ibb.co/ggfZWPD/vitalik.png">

At that time it grabbed the attention of almost the entire crypto space and the answers regarding that question were mostly a big “Not many if at all”. Of course, there have been isolated projects that try to work with the developed world with several big names attached, but not to much avail. Cryptocurrencies and blockchain technology from that time onwards has mostly been used by a few early adopters and some others, but were mostly already banked, educated people, even in the developing world.

Now, let’s ask that same question today; How many unbanked have we banked by the year 2021? Despite having made great progress and having outliers like the country of El Salvador, outside of that, the progress is almost null. Most of the same people that are into crypto today have been in for years and are the same elite, educated, previously banked ones, it has not reached those who are not.

We can say that because our team lives in one of those developing countries that countless projects try to portray as a target for financial inclusion, which is Mexico.

And yes, Mexico is the perfect target as it is the largest issuer of remittances from the US and it will break $42Billion this year alone.

<img src="https://cdn.howmuch.net/articles/outgoing-remittances-usa-final-8374.jpg" width="400">

Of course, remembering that the US is the biggest sender of remittances in the world.

It is important to mention that, according to the World Bank, 65% of Mexican adults do not have any type of bank account and only 10% save through a financial institution, in addition to the fact that 83% of Mexican adults do not have access to electronic payment systems. These circumstances limit the potential of the sector to place the resources of savers in productive projects that generate economic development and well-being for the population. And crypto is not doing better than the legacy system, most of the users are people like our team, tech savvy with a certain degree of education and already banked.

# Solution

BNBpoint is a Mobile-First wallet, cash out ramp and Point of Sale Superapp. We combine TradFi through Rapyd with Web3 to improve Financial Inclusion in Mexico and LATAM

System's Architecture:

<img src="https://i.ibb.co/sFDnB9B/Scheme-drawio-1.png">

- All BSC and Cross-chain transactions are controlled through [web3.js](https://web3js.readthedocs.io/en/v1.8.0/) and [WalletConnect](https://walletconnect.com/) on mainnet.

- Thanks to the Rapyd APIs we can manage users, checkout, swap and KYC of our app. (https://www.rapyd.net/)

- Through Rapyd's APIs we can manage users, checkout, swap and KYC of our app. (https://www.rapyd.net/)

- Wallet Connect is used as a secure connection to transmit the Point of Sale transactions to the Wallet, this connection is similar to a WebSocketSecure method and is widely adopted in EVM wallets.

- ChainLink is used for its price feeds for each of the most popular assets in the cryptocurrency market.

- Swap is the only section of our platform that we coordinate Fiat and Crypto services to exchange cryptocurrencies to dollars, this being BNB to USD.

- Connext es el servicio de bridge on-chain para realizar las transferencias de un chain a otra, todas las transacciones sobre esta network se pueden ver en el explorer de Connext. 

https://connextscan.io/address/0x4Cda9fEB9aF312B6FC6F716EE4415e6a52e0672C

# Cross-chain Transfers:

All transactions that require transfers from one chain to another we use the [Connext SDK](https://www.npmjs.com/package/@connext/smart-contracts).

Para mandar cualquier token desde cualquier red, nos comunicamos con el contrato principal de Connext en cada una de las chains, todos los contratos poseen la misma funcion para mandar dinero de una chain a otra.

    connext.xcall{value: relayerFee}(
        destinationDomain, // Domain ID of the destination chain
        target, // address of the target contract
        address(0), // address of the token contract
        msg.sender, // address that can revert or forceLocal on destination
        0, // amount of tokens to transfer
        100, // max slippage the user will accept in BPS (100 = 1% Recommended by Connext Main Developers)
        "" // Nothing in this case
    );

En nuestra implementacion actualizada a 5/13/2023, los tokens que podemos mandar crosschain son USDC, USDT, WETH y DAI.

<img src="https://i.ibb.co/vxC2kd2/Scheme-Connext-drawio.png">

Toda la implementacion esta en el codigo de POS en la funcion xTransferToken.

[xTransferToken CODE](./BNBpoint-POS-RN/src/screens/wcComponent.js)

# Main App Screens:

La wallet principal es compatible con las 6 redes disponibles el connext, Ethereum, Optimism, Polygon, Arbitrum, BSC y Gnosis, puedes seleccionar la que sera por defecto para pagar.

<img src="https://i.ibb.co/khn3ZYV/vlcsnap-2023-05-12-16h27m34s190.png" width="32%"> <img src="https://i.ibb.co/4T7QChK/vlcsnap-2023-05-12-16h27m27s788.png" width="32%">

- In turn, through Rapyd and BSC we can have total control of the movements and transactions of our account in both Crypto and Fiat.

- Crypto

<img src="https://i.ibb.co/QHYMhtv/vlcsnap-2023-05-12-16h27m42s515.png" width="32%"> <img src="https://i.ibb.co/TPzhRMX/vlcsnap-2023-05-12-16h27m53s586.png" width="32%"> <img src="https://i.ibb.co/tHcwghK/Screenshot-20230512-164300.png" width="32%">

- Fiat

<img src="https://i.ibb.co/p0n9327/Screenshot-20230512-170901.png" width="32%"> <img src="https://i.ibb.co/BcNmmSY/Screenshot-20230512-164318.png" width="32%"> <img src="https://i.ibb.co/6Ntt5jc/Screenshot-20230512-164335.png" width="32%">

- The KYC of our application is controlled by Rapyd and to confirm it, the documents must match the user's registration.

  <img src="https://i.ibb.co/BLjRB8x/image.png" width="32%">

- Through BSC we can also make transfers directly between Wallets.

  - First we must click on the pay button.

    <img src="https://i.ibb.co/FWb55Bs/vlcsnap-2023-05-12-16h27m42s515.png" width="32%">

  - We must select if we want to Recieve or Scan/NFC (by default the app opens the Recieve option). In the case of this main app, payment is allowed through NFC to our POS as part of the adoption of this technology in traditional payments.

    <img src="https://i.ibb.co/pzfBYvq/vlcsnap-2023-05-12-16h50m25s648.png" width="32%">
    <img src="https://i.ibb.co/TrZKQwm/Screenshot-20230512-180139.png" width="32%">

  - In the case of Scan/NFC, we open a QR scanner which will take us through a very simple transfer process, each transaction needs biometric or pin confirmation.

    <img src="https://i.ibb.co/56mHTL0/vlcsnap-2023-05-12-16h50m39s062.png" width="32%">
    <img src="https://i.ibb.co/55FxtSq/vlcsnap-2023-05-12-16h50m43s060.png" width="32%">
    <img src="https://i.ibb.co/B4y17nT/vlcsnap-2023-05-12-16h50m52s439.png" width="32%">

  - Transaction if you want to check:
  https://bscscan.com/tx/0xdc08ec2a22a0c15897fdaa0246769ceb3655fbfbc7fa339c648c84feff3ac0cf

    <img src="https://i.ibb.co/PmKTycm/vlcsnap-2023-05-12-16h51m03s692.png" width="32%">

- We carry out BSC (BNB) and Fiat transfers by coordinating the services of BSC and Rapyd. Transferring the equivalent of BNB or USD currency from BNBpoint Master accounts.

  <img src="https://i.ibb.co/f1Th2Zf/Screenshot-20230512-172038.png" width="32%">

- At the same time, we can obtain a virtual card from the Rapyd API to be able to spend the money from our Fiat account directly.

  <img src="https://i.ibb.co/6Ntt5jc/Screenshot-20230512-164335.png" width="32%">

- Additionally, we can make a Card Debit deposit from our Fiat account to a any debit cards.

  <img src="https://i.ibb.co/hFPLBYk/vlcsnap-2022-09-17-16h09m10s480.png" width="32%">

- All transfers made in the demos and during development can be consulted in the BSC explorer and Connext Explorer.

BSC Explorer:
https://bscscan.com/address/0x4Cda9fEB9aF312B6FC6F716EE4415e6a52e0672C

Connext Explorer:
https://connextscan.io/address/0x4Cda9fEB9aF312B6FC6F716EE4415e6a52e0672C

- This is a screenshot of our backend in Rapyd.

  <img src="https://i.ibb.co/vXD3Hzf/image.png">

# Point of Sale application:

- The Point of Sale application is more focused on the simple reception of payments and an interface focused on generating payment orders through QR or NFC.

- The POS allows us to see the Crypto and Fiat balances received along with the list of transactions just like the Main App.

  <img src="https://i.ibb.co/LhcSZNM/Screenshot-20230512-183057.png" width="32%">
  <img src="https://i.ibb.co/cry7P3Z/Screenshot-20230512-183105.png" width="32%">
  <img src="https://i.ibb.co/GJw215q/image.png" width="32%" >

- One of the most important processes is being able to make payments at the POS through WalletConnect, being this the pillar of our device. Tendremos que seleccionar la red origen que nos hara la transferencia y posteriormente el token que se usara para pagar, en este caso tenemos compatibilidad con USDC, USDT, WETH y DAI.

  <img src="https://i.ibb.co/QKf2bcM/vlcsnap-2023-05-12-17h35m25s606.png" width="32%">
  <img src="https://i.ibb.co/Y8gh2JH/vlcsnap-2023-05-12-17h35m50s148.png" width="32%">
  <img src="https://i.ibb.co/T2ykDRG/vlcsnap-2023-05-12-17h35m54s856.png" width="32%">

- When the reference is created by QR, it can be paid through any wallet compatible with WalletConnect, however our Main App also allows payment through NFC.

    <img src="https://i.ibb.co/JQ41FTB/image.png" width="32%">
    <img src="https://i.ibb.co/YB7GPc2/image.png" width="32%">
    <img src="https://i.ibb.co/chWhz2c/image.png" width="32%">

- Once the reference payment has been made, we will be able to see the confirmed and verified messages.

- In addition, we provide a printed receipt with the URL where you can check your transaction.

  <img src="https://i.ibb.co/6rstsM6/image.png" width="32%">

- Let's print!

    <img src="./Img/gifPrint.gif" width="32%">

# Current state and what's next

This application is directed at those who cannot benefit directly from cryptocurrency. It has the usual, both crypto and fiat wallets, transfers between crypto and fiat, transfers between crypto accounts and it gives a spin on the cash in - cash out portion of the equation as no other project provides it. It is very important if this application is going to benefit and bank people to be very agile and compatible with FIAT at least until crypto reaches mass market. Most of the developed world has not even incorporated to legacy electronic systems. In addition to that the incorporation of a Point of Sale thought mainly for SMEs is something that can be key in augmenting the change for further adoption.

I think we can make the jump from those systems almost directly to self-banking, such as the jump that was made in some parts of Africa and even here in Latin America from skipping telephone landlines directly to Mobile phones. If that jump was made from that type of technology this one can be analogous and possible.

Perhaps the most important feedback we have obtained is that we have to show how our application will ensure the enforcement of anti-laundering laws.

We will do that will strong KYC. And at the same time Mexico has published since 2018 strong laws to manage that including its fintech law.

https://en.legalparadox.com/post/the-definitive-guide-mexican-fintech-law-a-look-3-years-after-its-publication#:~:text=The%20Mexican%20FinTech%20Law%20was,as%20Artificial%20Intelligence%2C%20Blockchain%2C%20collaborative

Quoting: " The Mexican FinTech Law was one of the first regulatory bodies created specifically to promote innovation, the transformation of traditional banking and credit financial services that would even allow the possibility of incorporating exponential technology such as Artificial Intelligence, Blockchain, collaborative economies and peer-to-peer financial services in secure regulatory spaces. "

All of this was a silent revolution that happened in this jurisdiction after the HSBC money-laundering scandal that included cartels and some other nefarious individuals.
https://www.investopedia.com/stock-analysis/2013/investing-news-for-jan-29-hsbcs-money-laundering-scandal-hbc-scbff-ing-cs-rbs0129.aspx

Thus, the need for Decentralized solutions.

Security and identity verification of the clients who use the app is paramount for us, and to thrive in this market we need this to emulate incumbents such as Bitso. We think our technology is mature enough if we compare with these incumbents and much safer.

Regarding the application we would like to test it with real Capital perhaps in Q2 2023.

Hopefully you liked the Mobile DApp and Point of Sale.

# Team

#### 3 Engineers with experience developing IoT and hardware solutions. We have been working together now for 5 years since University.

[<img src="https://img.shields.io/badge/Luis%20Eduardo-Arevalo%20Oliver-blue">](https://www.linkedin.com/in/luis-eduardo-arevalo-oliver-989703122/)

[<img src="https://img.shields.io/badge/Victor%20Alonso-Altamirano%20Izquierdo-lightgrey">](https://www.linkedin.com/in/alejandro-s%C3%A1nchez-guti%C3%A9rrez-11105a157/)

[<img src="https://img.shields.io/badge/Alejandro-Sanchez%20Gutierrez-red">](https://www.linkedin.com/in/victor-alonso-altamirano-izquierdo-311437137/)

## References:

https://egade.tec.mx/es/egade-ideas/opinion/la-inclusion-financiera-en-mexico-retos-y-oportunidades

https://www.cnbv.gob.mx/Inclusi%C3%B3n/Anexos%20Inclusin%20Financiera/Panorama_IF_2021.pdf?utm_source=Panorama&utm_medium=email

https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2021/OtrTemEcon/ENDUTIH_2020.pdf

https://www.cnbv.gob.mx/Inclusi%C3%B3n/Anexos%20Inclusin%20Financiera/Panorama_IF_2021.pdf?utm_source=Panorama&utm_medium=email

https://www.rappi.com

https://www.rapyd.net/

https://www.pointer.gg/tutorials/solana-pay-irl-payments/944eba7e-82c6-4527-b55c-5411cdf63b23#heads-up:-you're-super-early

https://worldpay.globalpaymentsreport.com/en/market-guides/mexico

https://www.sipa.columbia.edu/academics/capstone-projects/cryptocurrency-and-unbankedunderbanked-world

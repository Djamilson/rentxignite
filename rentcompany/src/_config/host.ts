// import { Platform } from 'react-native';
// import { NetworkInfo } from 'react-native-network-info';

// const url = '192.168.0.125';
const url = 'www.ofertadodia.palmas.br/gostack';

/* if (__DEV__) {
  // Get Local IP
  const ip = NetworkInfo.getIPAddress();
  url = Platform.OS === 'android' ? '10.0.2.2' : ip;
} */
//10.0.0.90
//192.168.1.107

//const LOCALHOST = async () => await Network.getIpAddressAsync();
//LOCALHOST: '10.0.0.90',

export default {
  LOCALHOST: '10.0.0.90',
  PORT: 3335,
  WEBHOST: url,
};

import request from 'request-promise';
import config from '../../config/config';

const checkAddressFausetHub = async(faucethubAddress) => {
  try {
    const res = await request({
      method: 'POST',
      uri: 'https://faucethub.io/api/v1/checkaddress',
      form: {
        api_key: config.faucethub.api_key,
        address: faucethubAddress
      }
    });
    if (!(JSON.parse(res).status === 200)) {
      throw new Error("FausetHub Error");
    }
  } catch (error) {
    throw error;
  }
}
export const getPayootUserHashFausetHub = async(faucethubAddress) => {
  try {
    const res = await request({
      method: 'POST',
      uri: 'https://faucethub.io/api/v1/checkaddress',
      form: {
        api_key: config.faucethub.api_key,
        address: faucethubAddress
      }
    });
    return JSON.parse(res).payout_user_hash;
  } catch (error) {
    throw error;
  }
}
export default checkAddressFausetHub;

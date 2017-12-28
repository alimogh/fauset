import request from 'request-promise';
import config from '../../config/config';

const getReCaptchaResponse = async(gRecaptchaResponse) => {
  try {
    const res = await request({
      method: 'POST',
      uri: 'https://www.google.com/recaptcha/api/siteverify',
      form: {
        secret: config.google.recaptcha.secretKey,
        response: gRecaptchaResponse
      }
    });
    if (!JSON.parse(res).success) {
      throw new Error("reCAPTCHA");
    }
  } catch (error) {
    throw error;
  }

  // request({
  //     method: 'POST',
  //     uri: 'https://www.google.com/recaptcha/api/siteverify',
  //     form: {
  //         secret: config.google.recaptcha.secretKey,
  //         response: gRecaptchaResponse
  //     }
  // }).then(res=>JSON.parse(res)).then((res)=>{
  //     console.dir(res.success);
  //     if(res.success === true){
  //         return new Promise({});
  //     }else{
  //         return false;
  //     }
  // }).catch(()=>{
  //     return false;
  // });
}

export default getReCaptchaResponse;

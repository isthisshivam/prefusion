import axios from 'axios';
//import NetInfo from "@react-native-community/netinfo";
const requestTime = 50000;
const sortRequestTime = 50000;
import secrets from '../../../constants/secrets';
class RequestCreator {
  static async postRequest(url, param) {
    console.log('start >>> ' + 'url >>', url, 'params >', param);
    const instance = axios({
      method: 'POST',
      url: url,
      timeout: requestTime,
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "multipart/form-data",
      // },
      data: param,
    });

    return new Promise(function (resolve, reject) {
      instance
        .then(function (response) {
          //console.log("Api response success", JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (error) {
          console.log('Api response error', JSON.stringify(error));
          if (error.response != null) {
            reject(error.response.data);
          } else {
            reject({message: 'oops please try again.'});
          }
        });
    });
  }
  static async postRequestWithHeaderForConvertToken(url, param) {
    console.log('start >>> ' + 'url >>', url, 'params >', param);
    const instance = axios({
      method: 'POST',
      url: url,
      timeout: requestTime,
      headers: {
        Authorization:
          'key=AAAAv2ohSvI:APA91bFsI7vsuzzsszhWa39bs1qeTb_nnanlsl7fJjHMLQugGsq0Azs1uTYw2wDu5yq7DFsS-9D98kKrUJqEgjC9c1Ehfy_PdpaIVfi8yUtVlQJ16T28-vA18dKAwC8aDmg6bNsJuRek',
        'Content-Type': 'application/json',
      },
      data: param,
    });

    return new Promise(function (resolve, reject) {
      instance
        .then(function (response) {
          //console.log("Api response success", JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (error) {
          ///console.log("Api response error", JSON.stringify(error));
          if (error.response != null) {
            reject(error.response.data);
          } else {
            reject({message: 'oops please try again.'});
          }
        });
    });
  }
  static async postRequestWithHeader(url, param) {
    console.log('start >>> ' + 'url >>', url, 'params >', param);
    const instance = axios({
      method: 'POST',
      url: url,
      timeout: requestTime,
      headers: {
        Authorization:
          'key=AAAAv2ohSvI:APA91bFsI7vsuzzsszhWa39bs1qeTb_nnanlsl7fJjHMLQugGsq0Azs1uTYw2wDu5yq7DFsS-9D98kKrUJqEgjC9c1Ehfy_PdpaIVfi8yUtVlQJ16T28-vA18dKAwC8aDmg6bNsJuRek',
        'Content-Type': 'application/json',
      },
      data: param,
    });

    return new Promise(function (resolve, reject) {
      instance
        .then(function (response) {
          //console.log("Api response success", JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (error) {
          console.log('Api response error', JSON.stringify(error));
          if (error.response != null) {
            reject(error.response.data);
          } else {
            reject({message: 'oops please try again.'});
          }
        });
    });
  }
  static async getRequestForFood(url, param) {
    console.log('getRequestForFood', url + `?id=` + param);
    const instance = axios({
      method: 'GET',
      url: url + `?id=` + param,
      timeout: requestTime,
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "multipart/form-data",
      // },
      // data: url+`?uid=`+param,
    });

    return new Promise(function (resolve, reject) {
      instance
        .then(function (response) {
          console.log('Api response success', JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (error) {
          console.log('Api response error', JSON.stringify(error));
          if (error.response != null) {
            reject(error.response.data);
          } else {
            reject({message: 'oops please try again.'});
          }
        });
    });
  }
  static async getRequestWithGet(url, param) {
    console.log('getRequestWithGet', url + `?uid=` + param);
    const instance = axios({
      method: 'GET',
      url: url + `?uid=` + param,
      timeout: requestTime,
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "multipart/form-data",
      // },
      // data: url+`?uid=`+param,
    });

    return new Promise(function (resolve, reject) {
      instance
        .then(function (response) {
          console.log('Api response success', JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (error) {
          console.log('Api response error', JSON.stringify(error));
          if (error.response != null) {
            reject(error.response.data);
          } else {
            reject({message: 'oops please try again.'});
          }
        });
    });
  }
  static async PSTFD(url, param) {
    const instance = axios({
      method: 'POST',
      url: url,
      timeout: requestTime,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        // 'Access-Control-Request-Origin': '*',
        // 'X-Requested-With': 'XMLHttpRequest',
        // 'Access-Control-Allow-Origin': '*',
      },
      data: param,
    });

    return new Promise(function (resolve, reject) {
      instance
        .then(function (response) {
          // console.log('Api response success', JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch(function (error) {
          console.log('Api response error', JSON.stringify(error));
          if (error.response != null) {
            reject(error.response.data);
          } else {
            reject({message: 'oops please try again.'});
          }
        });
    });
  }
  // static apiWithHeader = (baseUrl, CONTENT_TYPE) => {
  //   axios.create({
  //     baseURL: baseUrl,
  //     method: 'post',
  //     timeout: TIMEOUT,
  //     headers: {
  //       'Content-Type': CONTENT_TYPE,
  //       'Access-Control-Request-Origin': '*',
  //       'X-Requested-With': 'XMLHttpRequest',
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //     data: {},
  //   });
  // };
  // static postApiCallImage = async (url, formData) => {
  //   const CONTENT_TYPE = 'multipart/form-data';
  //   return axios
  //     .create({
  //       baseURL: url,
  //       method: 'post',
  //       timeout: TIMEOUT,
  //       headers: {
  //         'Content-Type': CONTENT_TYPE,
  //         'Access-Control-Request-Origin': '*',
  //         'X-Requested-With': 'XMLHttpRequest',
  //         'Access-Control-Allow-Origin': '*',
  //       },
  //       data: formData,
  //     })
  //     .post(url, formData)
  //     .catch(function (error) {
  //       return error.response;
  //     });
  // };
}

export default RequestCreator;

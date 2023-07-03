/* eslint-disable eqeqeq */

import {
  ApiWorkerPost,
  ApiWorkerPostWithHeader,
  ApiWorkerGet,
  ApiWorkerPostFormData,
  ApiWorkerPostRequestWithHeaderForConvertToken,
  ApiWorkerGetForFood,
} from '../webservice/api_manager/RequestGenerator';
import ServerCodes from '../../constants/serverCodes';
export const postRequest = async (url, payload) => {
  //console.log('postRequest', JSON.stringify(payload));
  return await new Promise((resolve, reject) => {
    ApiWorkerPost(this, url, payload)
      .then(success => {
        // console.log('WEBSERVICE success', JSON.stringify(success));
        if (success.status == ServerCodes.success) {
          resolve(success);
        } else if (success.status == ServerCodes.error) {
          reject(success.message);
        }
      })
      .catch(error => {
        console.log('WEBSERVICE Error', JSON.stringify(error) + url);
        if (error.error) {
          reject(JSON.stringify(error.error));
        } else if (error.message) {
          reject(error.message);
        } else {
          reject(error);
        }
      });
  });
};
export const postRequestWithHeader = async (url, payload) => {
  //console.log('postRequest', JSON.stringify(payload));
  return await new Promise((resolve, reject) => {
    ApiWorkerPostWithHeader(this, url, payload)
      .then(success => {
        console.log('WEBSERVICE success', JSON.stringify(success));
        if (success.status == ServerCodes.success) {
          resolve(success);
        } else if (success.status == ServerCodes.error) {
          reject(success.message);
        }
      })
      .catch(error => {
        console.log('WEBSERVICE Error', JSON.stringify(error) + url);
        if (error.error) {
          reject(JSON.stringify(error.error));
        } else if (error.message) {
          reject(error.message);
        } else {
          reject(error);
        }
      });
  });
};
export const postRequestWithHeaderForConvertToken = async (url, payload) => {
  //console.log('postRequest', JSON.stringify(payload));
  return await new Promise((resolve, reject) => {
    ApiWorkerPostRequestWithHeaderForConvertToken(this, url, payload)
      .then(success => {
        console.log('WEBSERVICE success', JSON.stringify(success));
        if (success.results[0].status == 'OK') {
          resolve(success);
        } else {
          reject(success.message);
        }
      })
      .catch(error => {
        console.log('WEBSERVICE Error', JSON.stringify(error) + url);
        if (error.error) {
          reject(JSON.stringify(error.error));
        } else if (error.message) {
          reject(error.message);
        } else {
          reject(error);
        }
      });
  });
};
export const getRequest = async (url, payload) => {
  return await new Promise((resolve, reject) => {
    ApiWorkerGet(this, url, payload)
      .then(success => {
        console.log('WEBSERVICE success', JSON.stringify(success));

        if (success.status == ServerCodes.success) {
          resolve(success);
        } else if (success.status == ServerCodes.error) {
          reject(success.message);
        }
      })
      .catch(error => {
        console.log('WEBSERVICE Error', JSON.stringify(error) + url);
        if (error.message) {
          reject(error.message);
        } else {
          reject(error);
        }
      });
  });
};
export const getRequesForFood = async (url, payload) => {
  return await new Promise((resolve, reject) => {
    ApiWorkerGetForFood(this, url, payload)
      .then(success => {
        console.log('WEBSERVICE success', JSON.stringify(success));

        if (success.status == ServerCodes.success) {
          resolve(success);
        } else if (success.status == ServerCodes.error) {
          reject(success.message);
        }
      })
      .catch(error => {
        console.log('WEBSERVICE Error', JSON.stringify(error) + url);
        if (error.message) {
          reject(error.message);
        } else {
          reject(error);
        }
      });
  });
};

export const postRequestFormData = async (url, payload) => {
  console.log('postRequestTypeFormData', payload);
  return await new Promise((resolve, reject) => {
    ApiWorkerPostFormData(this, url, payload)
      .then(success => {
        console.log('WEBSERVICE success', JSON.stringify(success));
        if (success.status == ServerCodes.success) {
          resolve(success);
        } else if (success.status == ServerCodes.error) {
          reject(success.message);
        }
      })
      .catch(error => {
        console.log('WEBSERVICE Error', JSON.stringify(error) + url);
        if (error.error) {
          reject(JSON.stringify(error.error));
        } else if (error.message) {
          reject(error.message);
        } else {
          reject(error);
        }
      });
  });
};

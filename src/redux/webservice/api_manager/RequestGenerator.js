import RequestCreator from './RequestCreater';

export async function ApiWorkerPost(ref, url, param) {
  //', JSON.stringify(param));
  return await RequestCreator.postRequest(url, param);
}
export async function ApiWorkerPostWithHeader(ref, url, param) {
  console.log('ApiWorkerPostWithHeader', JSON.stringify(param));
  return await RequestCreator.postRequestWithHeader(url, param);
}
export async function ApiWorkerPostRequestWithHeaderForConvertToken(
  ref,
  url,
  param,
) {
  console.log('ApiWorkerPostWithHeader', JSON.stringify(param));
  return await RequestCreator.postRequestWithHeaderForConvertToken(url, param);
}

export async function ApiWorkerGet(ref, url, param) {
  return await RequestCreator.getRequestWithGet(url, param);
}
export async function ApiWorkerGetForFood(ref, url, param) {
  return await RequestCreator.getRequestForFood(url, param);
}

export async function ApiWorkerPostFormData(ref, url, param) {
  console.log('ApiWorkerPostFormData', JSON.stringify(param));
  return await RequestCreator.PSTFD(url, param);
}

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
};

const Path = {
  GET_PATH: 'https://28.javascript.pages.academy/kekstagram/data',
  POST_PATH: 'https://28.javascript.pages.academy/kekstagram'
};

const requestData = (requestPath, requestMethod = 'GET', requestBody = null) =>
  fetch(requestPath, { method: requestMethod, body: requestBody })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error();
    });

const getData = () => requestData(Path.GET_PATH, HttpMethod.GET, null);

const postData = (body) => requestData(Path.POST_PATH, HttpMethod.POST, body);

export { getData, postData};


import Cookies from 'js-cookie';

export const toJson = (formdata) => {
  const data = {};
  formdata.forEach((value, key) => {
    if (value.length) data[key] = value;
  });
  return data;
};

export const sendRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
      {
        method: 'GET',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      // throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    // Handle any errors here
    console.error('Error:', error);
    throw error; // Re-throw the error to allow the caller to handle it if needed
  }
};

export const uploadToServer = async (event, path) => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${Cookies.get('token')}`);

  var formdata = new FormData();
  // for (var i = 0; i < event.target.files.length; i++) {
  //   formdata.append("files", event.target.files[i], event.target.files[i].name);
  // }
  formdata.append('files', event.target.files[0], event.target.files[0].name);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    body: formdata,
    redirect: 'follow',
  };
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    // Handle any errors here
    console.error('Error:', error);
    throw error; // Re-throw the error to allow the caller to handle it if needed
  }
};

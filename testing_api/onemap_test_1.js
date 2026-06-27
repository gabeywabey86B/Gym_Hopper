const url = "https://www.onemap.gov.sg/api/public/themesvc/getAllThemesInfo?moreInfo=Y";
const authToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNzM4MSwiZm9yZXZlciI6ZmFsc2UsImlzcyI6Ik9uZU1hcCIsImlhdCI6MTc4MjQ1MjM4NCwibmJmIjoxNzgyNDUyMzg0LCJleHAiOjE3ODI3MTE1ODQsImp0aSI6IjNjZjY0OWFkLTdlZmQtNGU0OC1iOTY2LTA0ZDRhN2QzYTkzMyJ9.Ns6Kg1X_5T3xRDOI3A1OSuD9I5RZ44uQwYDK188xHxC57a2xNwrI0Y0uFUqGIVCFNY35V-l9Sp1NZWsYRfHkJDR9e_kwqc2IDdM7b_EQxxB4ZuTfCNxbztCgOXeb6skl9ZjIt31GhPUiUX1qY5WaQp0UQDQHqOAzIY8HQPnmHEjf2JdBe7tre4JOBYMf7oMs4Wn0Z8vCL4M1QtJ892ch05uGf0dVgyu2IugYvIS57RqH3ZDy6d11wb0GkucYceVSQtDMCKo5Et3WUEkafHvVZVcxtFS4GWndEpOAiPKmFrnt6vkDxqlO-2dd2fXJVKTMJ5cEIx86JmbGIAmfOb2mlA';  // Replace with your access token

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `${authToken}`,  // API token for authorization
  }
})
.then(response => response.json())  // Parse response as JSON
.then(data => console.log(data))     // Log the data to the console
.catch(error => console.error('Error:', error));  // Log any errors

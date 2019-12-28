const mockServices = (mocked, servicesToMock, mockData) => {
  if (!mocked) return servicesToMock;

  console.log(mockData);
  console.log(mockData.getAllUsers);

  return Object.keys(servicesToMock).reduce(
    (mockedServices, serviceName) => ({
      ...mockedServices,
      [serviceName]: () =>
        new Promise(resolve => {
          setTimeout(() => resolve(mockData[serviceName]), 1000);
        }),
    }),
    {},
  );
};

export { mockServices };

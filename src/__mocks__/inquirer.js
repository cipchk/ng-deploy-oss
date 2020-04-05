const inquirerMock = jest.genMockFromModule('inquirer');

inquirerMock.prompt = jest.fn(() => {
  return {
    sub: 'subMock'
  };
});

module.exports = inquirerMock;

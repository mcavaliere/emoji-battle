export const fakeAblyChannel = {
  callback: jest.fn(),
  published: [],
  subscribe: function (callback) {
    this.callback = callback;
  },
  publish: function (message: never) {
    this.published.push(message);
    this.callback(message);
  },
};

export class AblyStub {
  fakeAblyChannel = fakeAblyChannel;
  connection = { on: function (string) {} };
  channels = {
    get: function (chName) {
      return fakeAblyChannel;
    },
  };
}

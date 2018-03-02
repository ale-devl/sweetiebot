/* global sinon, proxyquire */

describe("Bot init", () => {
    let bot;

    function requireBot(mocks) {
        bot = proxyquire("../api/bot/bot.js", mocks);
    }

    afterEach(() => {
        delete require.cache[bot];
    });

    it("should init the bot without errors when login is fine", done => {
        // arrange
        let oStubs =
            {
                oLoginStub: sinon.stub().returnsPromise().resolves(),
                oSingleHealthCheckStub: sinon.stub().returnsPromise().resolves(),
                oRegisterHealthChecksStub: sinon.stub(),
                oOnStub: sinon.stub()
            },
            oMockClient = {
                login: oStubs.oLoginStub,
                on: oStubs.oOnStub
            };

        requireBot({
            "discord.js": {
                Client: function () {
                    return oMockClient;
                },
                "@noCallThru": true
            },
            "../util/health_checker": {
                singleHealthCheck: oStubs.oSingleHealthCheckStub,
                registerHealthChecks: oStubs.oRegisterHealthChecksStub,
                "@noCallThru": true
            }
        });

        // act
        bot.init()
            .then(() => {
                oStubs.oLoginStub.should.have.been.calledOnce;
                oStubs.oSingleHealthCheckStub.should.have.been.calledOnce;
                oStubs.oRegisterHealthChecksStub.should.have.been.calledOnce;
                Object.keys(oStubs).forEach(key => {
                    oStubs[key].reset();
                });
                done();
            })
            .catch(error => {
                done(new Error("Bot init rejected with error: " + error));
            });
    });
});
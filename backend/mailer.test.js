// mailer.test.js
const transporter = require('./mailer');
const transporter = require('./transporter'); 
describe('Mailer', () => {
    it('should create a transporter', () => {
        expect(transporter).toBeDefined();
    });
test('should send email successfully', done => {
    const mailOptions = {
        from: 'wasieacuna@gmail.com',
        to: 'wasieacuna@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email sent from Node.js!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            done(error);
        } else {
            expect(info.response).toMatch(/OK/); 
            done();
        }
    });
});
});

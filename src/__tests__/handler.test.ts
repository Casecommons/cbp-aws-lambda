import jestPlugin from 'serverless-jest-plugin'
import * as mod from '../handler'
import adminCreateUserEvent from './admin-create-user-event.json'
import adminResendCodeEvent from './admin-resend-invitation-event.json'
import forgotPasswordEvent from './forgot-password-event.json'
import verifyUserAttributeEvent from './verify-user-attribute-event.json'
import signUpUserEvent from './signup-user-event.json'
import resendVerifiationCodeEvent from './resend-verification-code-event.json'

const lambdaWrapper = jestPlugin.lambdaWrapper
const wrapped = lambdaWrapper.wrap(mod)
const env = {...process.env}

const expectedInvitationEmailBody = 'John Smith, \<br\> \<br\>' +
  'You\'ve been added to Casebook. Please follow this link to activate your account: https://testTenant.casebook.net/.\<br\>' +
  'Your associated email address is userName@test.com and your temporary password is yourTempPassword.\<br\>' +
  'Please note that this invitation will expire in 24 hours.'

  const expectedSelfRegistrationVerifcationEmailBody = 'Hello John Smith, \<br\> \<br\>' +
        'Thanks for signing up with Test Tenant. ' +
        'To complete your account setup, please follow: https://testTenant.casebook.net/authentication/login?verificationCode=1234567&username=userName@test.com \<br\>' +
        'Once you verify, you will be able to log in to your account. \<br\> \<br\>' +
        'This link is valid for the next 24 hours only.  \<br\> \<br\>' +
        'Thanks!'


beforeEach(() => {
    process.env = env
    process.env.DOMAIN_POSTFIX = ''
})

describe('Customize Admin Create Message', () => {
    it('returns customized invitation message', () => (
      wrapped.run(adminCreateUserEvent).then((response) => {
        expect(response.response.emailMessage).toEqual(expectedInvitationEmailBody)
        expect(response.response.emailSubject).toEqual('Your Casebook Account Information')
      })
    ))
  })

  describe('Customize Resend Code Message', () => {
    it('returns customized invitation message', () => (
      wrapped.run(adminResendCodeEvent).then((response) => {
        expect(response.response.emailMessage).toEqual(expectedInvitationEmailBody)
        expect(response.response.emailSubject).toEqual('Your Casebook Account Information')
      })
    ))
  })

  describe('Customize Forgot Password Message', () => {
    it('returns customized forgot password message', () => (
      wrapped.run(forgotPasswordEvent).then((response) => {
         const expectedEmailBody = 'John Smith, \<br\> \<br\>You recently requested to reset your password for your Casebook account. '
            + 'Your verification code is testVerificationCode and the code is valid for 1 hour. '
            + 'Please follow this link to complete the reset process (click link or paste entire URL into a browser address line): '
            + 'https://testTenant.casebook.net/authentication/reset-password \<br\> \<br\>'
            + 'Please do not share this code with anyone. \<br\>'
            + "If you would rather not reset your password or you didn't make this request, then you can ignore this email, and your password will not be changed."
        expect(response.response.emailMessage).toEqual(expectedEmailBody)
        expect(response.response.emailSubject).toEqual('Reset your password')
      })
    ))
  })

  describe('Customize Message with DEV Domain Postfix', () => {
    beforeEach(() => {
      process.env.DOMAIN_POSTFIX = 'dev'
    })
    it('returns customized forgot password message with prod domain', () => (
      wrapped.run(forgotPasswordEvent).then((response) => {
         const expectedEmailBody = 'John Smith, \<br\> \<br\>You recently requested to reset your password for your Casebook account. '
            + 'Your verification code is testVerificationCode and the code is valid for 1 hour. '
            + 'Please follow this link to complete the reset process (click link or paste entire URL into a browser address line): '
            + 'https://testTenant.casebookdev.net/authentication/reset-password \<br\> \<br\>'
            + 'Please do not share this code with anyone. \<br\>'
            + "If you would rather not reset your password or you didn't make this request, then you can ignore this email, and your password will not be changed."
        expect(response.response.emailMessage).toEqual(expectedEmailBody)
        expect(response.response.emailSubject).toEqual('Reset your password')
      })
    ))
  })

  describe('Test non customized Message', () => {
    it('returns original Cognito verify attribute message', () => (
      wrapped.run(verifyUserAttributeEvent).then((response) => {
        expect(response.response.emailMessage).toEqual('Cognito Default Message')
        expect(response.response.emailSubject).toEqual('Cognito Default Subject')
      })
    ))
  })

  describe('Customize Sign Up Message', () => {
    it('returns customized sign up message', () => (
      wrapped.run(signUpUserEvent).then((response) => {
        expect(response.response.emailMessage).toEqual(expectedSelfRegistrationVerifcationEmailBody)
        expect(response.response.emailSubject).toEqual('Welcome to Test Tenant. Please verify your email')
      })
    ))
  })

  describe('Customize Resend Verification Code Message', () => {
    it('returns customized resend verfication code message', () => (
      wrapped.run(resendVerifiationCodeEvent).then((response) => {
        expect(response.response.emailMessage).toEqual(expectedSelfRegistrationVerifcationEmailBody)
        expect(response.response.emailSubject).toEqual('Welcome to Test Tenant. Please verify your email')
      })
    ))
  })

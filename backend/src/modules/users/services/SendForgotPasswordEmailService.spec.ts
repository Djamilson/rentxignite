import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/fakeMailProvider';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '12344',
    });

    await sendForgotPasswordEmail.execute({
      email: 'djoo@bol.com.br',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should generate a forgot password token', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'djoo@bol.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to recover the password using the email', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '12344',
    });

    await sendForgotPasswordEmail.execute({
      email: 'djoo@bol.com.br',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});

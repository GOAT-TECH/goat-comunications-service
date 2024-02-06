import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendMailDTO } from 'src/controllers/send-email/send-mail-dto';

@Processor('mail-queue')
export class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job<SendMailDTO>) {
    console.log(
      `Processing job ${job.id} sending email with email ${job.data.from}...`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<Job>, error: Error) {
    console.log(`Error in job: ${job.id}. Error: ${error.message}`);
  }

  @Process('mail-job')
  async sendMailJob(job: Job<SendMailDTO>) {
    const { data } = job;

    console.log(data);

    await this.mailService.sendMail({
      to: data.to,
      from: data.from,
      subject: data.subject,
      template: `./${data.template}`,
      context: data.context,
    });
  }
}

import { Module } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { SendMailProducerService } from './producers/mail/jobs/sendMail-producer-service';
import { SendMailConsumer } from './producers/mail/jobs/sendMail-consumer';
import { Queue } from 'bull';
import { MiddlewareBuilder } from '@nestjs/core';
import { createBullBoard } from '@bull-board/api';
import { SendEmailController } from './controllers/send-email/send-email.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BasicAuthMiddleware } from './middlewares/basic-auth-middleware';

console.log(process.env.REDIS_HOST, process.env.REDIS_PORT)
@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          port: Number(process.env.SMTP_PORT),
        },
        defaults: {
          port: Number(process.env.SMTP_PORT),
        },
        template: {
          dir: '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [SendEmailController],
  providers: [SendMailProducerService, SendMailConsumer],
})
export class AppModule {
  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/bull');

    createBullBoard({
      queues: [new BullMQAdapter(this.mailQueue)],
      serverAdapter,
    });

    consumer
      .apply(BasicAuthMiddleware, serverAdapter.getRouter())
      .forRoutes('/admin/bull');
  }
}

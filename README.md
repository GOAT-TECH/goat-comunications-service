# Simple Mail

**Simple Mail** is a prebuilt application for mail sending, supporting multiple templates and variables.

## How to run
We designed it to be user primarily with Docker, but it can, with some light code modification be ran bare.


Be sure that your `.env` file has the needed variables:
- `SMTP_HOST`: Your mailing server host
- `SMTP_PORT`: Your mailing server port
- `SMTP_USER`: Your mailing server username
- `SMTP_PASS`: Your mailing server password
- `REDIS_HOST`: Host of the redis instance to use. If using redis within the same `docker-compose.yml` can be set to `redis`
- `REDIS_PORT`: Port that the redis instance is running on. The default port for redis instances is `6379`.
- `REDIS_PASSWORD`: Password for the redis instance. If none, can be left empty.
- `DASHBOARD_USERNAME`: Username to login to Bull dashboard
- `DASHBOARD_PASSWORD`: Password to login to Bull dashboard

### Templates
You'll need to provide the templates that the application can access and use. To do so, you can change the `/path/to/your/templates/folder` to a folder that contains you templates.

These templates must be handlebars templates, they'll be selected on request time.

## Usage
After everything is up and running, you might want to send emails.

The API has only one endpoint: `/send-email`.
- Type: `POST`
- Endpoint: `/send-email`
- Body: `JSON`

#### Body Example
```json
{
  "from": "noreply@example.com", // Sender Email
  "to": "john@example.com", // Recipient Email
  "subject": "Test", // Email Subject
  "context": {
    "name": "Jarvan Five" // Variable defined in handlebars template
    // These are dynamic, if your template uses it, it must, or can be passed through here.
  }
}
```


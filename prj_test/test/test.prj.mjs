import cote from 'cote';

const statusService = new cote.Responder({ name: 'status-service', namespace: 'status' });

statusService.on('getStatus', async (body, cb) => {
  console.log('Получил запрос на получение status');
  console.log(`Отправляю запроc: ${body.body}`);
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      const a = { status: 'ok' };
      console.log(`Выполнил таймер, ${JSON.stringify(a)}`);
      resolve(a);
    }, 1000);
  });
  cb(result);
});
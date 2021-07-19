export default {
  translation: {
    appName: 'RSS Агрегатор',
    button: {
      urlAdd: 'Добавить',
    },
    form: {
      status: {
        ready: 'Готов к работе',
        validation: 'Проверяю ссылку',
        loading: 'Получаю данные',
        success: 'Успешно загружено',
      },
      error: {
        validation: {
          url: 'Ссылка должна быть валидным URL',
          unique: 'Такой ресурс уже загружен',
        },
        loading: 'Нет интернета или ресурс недоступен',
        parsing: 'Ресурс не содержит валидный RSS',
      },
      exampleText: 'Пример: ',
      exampleLink: 'https://ru.hexlet.io/lessons.rss',
      inputPlaceholder: 'Ссылка RSS',
    },
  },
};

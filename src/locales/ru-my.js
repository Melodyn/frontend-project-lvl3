export default {
  translation: {
    appName: 'RSS Агрегатор',
    button: {
      urlAdd: 'Добавить',
      show: 'Просмотр',
      read: 'Читать полностью',
      close: 'Закрыть',
    },
    form: {
      status: {
        ready: 'Готов к работе',
        processing: 'Проверяю, качаю, подготавливаю...',
        success: 'RSS успешно загружен',
      },
      error: {
        validation: {
          url: 'Ссылка должна быть валидным URL',
          unique: 'RSS уже существует',
        },
        loading: 'Ошибка сети',
        parsing: 'Ресурс не содержит валидный RSS',
      },
      exampleText: 'Пример: ',
      exampleLink: 'https://ru.hexlet.io/lessons.rss',
      inputPlaceholder: 'Ссылка RSS',
    },
    reader: {
      feeds: 'Фиды',
      posts: 'Посты',
    },
  },
};

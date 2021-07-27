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
    reader: {
      feeds: 'Фиды',
      posts: 'Посты',
    },
  },
};

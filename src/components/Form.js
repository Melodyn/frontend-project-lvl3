import { createElement, createParser } from '../helpers.js';

const formStatusColors = ['text-primary', 'text-success', 'text-danger'];

const rssValid = '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title><![CDATA[Lorem ipsum feed for an interval of 1 minutes with 10 item(s)]]></title><description><![CDATA[This is a constantly updating lorem ipsum feed]]></description><link>http://example.com/</link><generator>RSS for Node</generator><lastBuildDate>Mon, 19 Jul 2021 15:38:12 GMT</lastBuildDate><pubDate>Mon, 19 Jul 2021 15:38:00 GMT</pubDate><copyright><![CDATA[Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.]]></copyright><ttl>1</ttl><item><title><![CDATA[Lorem ipsum 2021-07-19T15:38:00Z]]></title><description><![CDATA[Id veniam in sint cupidatat cillum dolor proident.]]></description><link>http://example.com/test/1626709080</link><guid isPermaLink="true">http://example.com/test/1626709080</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:38:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:37:00Z]]></title><description><![CDATA[Sit ipsum exercitation magna minim.]]></description><link>http://example.com/test/1626709020</link><guid isPermaLink="true">http://example.com/test/1626709020</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:37:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:36:00Z]]></title><description><![CDATA[Consequat culpa eiusmod amet irure excepteur dolor sit amet.]]></description><link>http://example.com/test/1626708960</link><guid isPermaLink="true">http://example.com/test/1626708960</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:36:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:35:00Z]]></title><description><![CDATA[Veniam non ex eu elit ad esse nisi aliquip.]]></description><link>http://example.com/test/1626708900</link><guid isPermaLink="true">http://example.com/test/1626708900</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:35:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:34:00Z]]></title><description><![CDATA[Dolor sit ut consectetur eu elit laboris labore Lorem est nisi id laborum laborum deserunt.]]></description><link>http://example.com/test/1626708840</link><guid isPermaLink="true">http://example.com/test/1626708840</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:34:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:33:00Z]]></title><description><![CDATA[Laboris magna eu laborum do enim dolore fugiat anim cupidatat ipsum.]]></description><link>http://example.com/test/1626708780</link><guid isPermaLink="true">http://example.com/test/1626708780</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:33:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:32:00Z]]></title><description><![CDATA[In ipsum enim excepteur eiusmod tempor nostrud ullamco magna quis.]]></description><link>http://example.com/test/1626708720</link><guid isPermaLink="true">http://example.com/test/1626708720</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:32:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:31:00Z]]></title><description><![CDATA[Voluptate exercitation adipisicing proident non elit voluptate reprehenderit nulla.]]></description><link>http://example.com/test/1626708660</link><guid isPermaLink="true">http://example.com/test/1626708660</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:31:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:30:00Z]]></title><description><![CDATA[Occaecat deserunt occaecat ad ipsum id ullamco dolore ullamco sunt ea ad aliqua.]]></description><link>http://example.com/test/1626708600</link><guid isPermaLink="true">http://example.com/test/1626708600</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:30:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2021-07-19T15:29:00Z]]></title><description><![CDATA[Consequat qui nostrud mollit laboris veniam eiusmod qui do.]]></description><link>http://example.com/test/1626708540</link><guid isPermaLink="true">http://example.com/test/1626708540</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Mon, 19 Jul 2021 15:29:00 GMT</pubDate></item></channel></rss>';
const rssInvalid = 'hello, world';

const elements = {
  form: createElement('form'),

  inputGroup: createElement('div', {
    classes: ['input-group', 'input-group-lg', 'py-2'],
  }),
  input: createElement('input', {
    id: 'url',
    name: 'url',
    type: 'url',
    required: true,
    class: 'form-control',
    'aria-describedby': 'url-add',
  }),
  button: createElement('button', {
    id: 'url-add',
    type: 'submit',
    classes: ['btn', 'btn-primary'],
  }),

  exampleContainer: createElement('p', {
    classes: ['ms-1', 'my-1', 'fw-bold', 'text-break', 'text-secondary'],
  }),
  exampleText: createElement('span'),
  exampleLink: createElement('span', { class: 'user-select-all' }),
  formStatus: createElement('p', {
    classes: ['me-1', 'mt-0', 'text-break', 'text-end'],
  }),
};

// ----

export default class Form {
  constructor(t) {
    this.t = t;
    this.elements = elements;
    this.parse = createParser();
  }

  init(view) {
    this.elements.button.textContent = this.t('button.urlAdd');
    this.elements.input.setAttribute('placeholder', this.t('form.inputPlaceholder'));
    this.elements.exampleText.textContent = this.t('form.exampleText');
    this.elements.exampleLink.textContent = this.t('form.exampleLink');
    this.elements.formStatus.textContent = this.t('form.status.ready');

    this.elements.exampleContainer.append(this.elements.exampleText, this.elements.exampleLink);
    this.elements.inputGroup.append(this.elements.input, this.elements.button);
    this.elements.form.append(
      this.elements.exampleContainer,
      this.elements.inputGroup,
      this.elements.formStatus,
    );

    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(e.target);
      const url = form.get('url');

      view.uiState.form.state = 'validation';

      if (view.streams.has(url)) {
        setTimeout(() => {
          view.uiState.form.errorStep = 'validation.unique';
          view.uiState.form.state = 'error';
        }, 2000);
      } else {
        setTimeout(() => {
          view.uiState.form.errorStep = null;
          view.uiState.form.state = 'loading';
        }, 2000);
        setTimeout(() => {
          Promise.resolve({ data: url.includes('rss') ? rssValid : rssInvalid })
            .then((res) => this.parse(res.data))
            .then((data) => {
              view.streams.set(url, data);
              view.uiState.form.errorStep = null;
              view.uiState.form.state = 'success';
            })
            .catch((err) => {
              if (err.message.includes('Data format is not RSS')) {
                view.uiState.form.errorStep = 'parsing';
              } else {
                view.uiState.form.errorStep = 'loading';
                console.error(err);
              }
              view.uiState.form.state = 'error';
            });
        }, 5000);
      }
    });
  }

  getElements() {
    return this.elements;
  }

  renderEmpty(stateName = 'ready') {
    this.elements.button.disabled = false;
    this.elements.input.disabled = false;
    this.elements.input.classList.remove('is-invalid');
    this.elements.form.reset();
    this.elements.input.focus();
    this.elements.formStatus.textContent = this.t(`form.status.${stateName}`);
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-primary');
  }

  renderProcess(stepName) {
    this.elements.button.disabled = true;
    this.elements.input.disabled = true;
    this.elements.formStatus.textContent = this.t(`form.status.${stepName}`);
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-success');
  }

  renderError(stepName) {
    this.elements.button.disabled = false;
    this.elements.input.disabled = false;
    this.elements.formStatus.textContent = this.t(`form.error.${stepName}`);
    this.elements.formStatus.classList.remove(...formStatusColors);
    this.elements.formStatus.classList.add('text-danger');
    this.elements.input.classList.add('is-invalid');
    this.elements.input.select();
    this.elements.input.focus();
  }
}

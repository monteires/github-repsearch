import api from './api';

/* Classe para controle da aplicação */
class App {
  constructor() {
    this.repositories = [];

    this.formEl = document.querySelector('#repo-form');
    this.inputEl = document.querySelector('input[name=repository]');
    this.listEl = document.querySelector('#repo-list');
    
    this.registerHandlers();
  }

  /* Listen events on app */
  registerHandlers() {
    this.formEl.onsubmit = event => this.addRepository(event);
  }


  /* Loading */

  setLoading(loading = true) {
    if (loading === true) {
      let loadingEl = document.createElement('span');
      loadingEl.appendChild(document.createTextNode('Carregando...'));
      loadingEl.setAttribute('id','loading');
      
      this.formEl.appendChild(loadingEl);
    } else {
      document.getElementById('loading').remove();
    }
  }

  /* Add repository */
  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    if(repoInput.length === 0) {
      alert('Escreva algo...') 
      return;
    }
    
    this.setLoading();
 
    try {
      const response = await api.get(`${repoInput}`);
  
    const {name, description, html_url, owner: { avatar_url } } = response.data;

    this.repositories.push({
      name,
      description,
      avatar_url,
      html_url
    });

    this.render();
    } catch (err) {
      alert('O repositório não foi encontrado...') 
    }

    this.setLoading(false);
  }


  render() {
    this.listEl.innerHTML = '';

    this.repositories.forEach(repo => {
      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', repo.avatar_url);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '__blank');
      linkEl.setAttribute('href', repo.html_url);
      linkEl.appendChild(document.createTextNode('Acessar'));

      let liElement = document.createElement('li');
      liElement.appendChild(imgEl);
      liElement.appendChild(titleEl);
      liElement.appendChild(descriptionEl);
      liElement.appendChild(linkEl);

      this.listEl.appendChild(liElement);

    });
  }
}

new App();
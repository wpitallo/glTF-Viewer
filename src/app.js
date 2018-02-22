const Detector = require('three/examples/js/Detector');
const Viewer = require('./viewer');
const DropController = require('./drop-controller');
const ValidationController = require('./validation-controller');
const queryString = require('query-string');

if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
  console.error('The File APIs are not fully supported in this browser.');
} else if (!Detector.webgl) {
  console.error('WebGL is not supported in this browser.');
}

class App {

  /**
   * @param  {Element} el
   * @param  {Location} location
   */
  constructor (el, location) {

    const hash = location.hash ? queryString.parse(location.hash) : {};
    this.options = {
      kiosk: Boolean(hash.kiosk),
      model: hash.model || ''
    };

    this.el = el;
    this.viewer = null;
    this.viewerEl = null;
    this.spinnerEl = el.querySelector('.spinner');
    this.dropEl = el.querySelector('.dropzone');
    this.validationCtrl = new ValidationController(el);

    this.createDropzone();
    this.hideSpinner();


    const options = this.options;

    if (options.kiosk) {
      const headerEl = document.querySelector('header');
      headerEl.style.display = 'none';
    }
debugger

      this.view();

  }

  /**
   * Sets up the drag-and-drop controller.
   */
  createDropzone () {
    this.dropCtrl = new DropController(this.dropEl);
    this.dropCtrl.on('drop', ({rootFile, rootPath, fileMap}) => { console.log(rootFile, rootPath, fileMap); this.view(rootFile, rootPath, fileMap) } );
    this.dropCtrl.on('dropstart', () => this.showSpinner());
    this.dropCtrl.on('droperror', () => this.hideSpinner());
  }

  /**
   * Sets up the view manager.
   * @return {Viewer}
   */
  createViewer () {
    this.viewerEl = document.createElement('div');
    this.viewerEl.classList.add('viewer');
    this.dropEl.innerHTML = '';
    this.dropEl.appendChild(this.viewerEl);
    this.viewer = new Viewer(this.viewerEl, {kiosk: this.options.kiosk});
    return this.viewer;
  }

  /**
   * Loads a model into the viewer, given file and resources.
   * @param  {File|string} rootFile
   * @param  {string} rootPath
   * @param  {Map<string, File>} fileMap
   */


  view () {

      if (this.viewer) this.viewer.clear();

      const viewer = this.viewer || this.createViewer();

    debugger
      viewer
          .load()
          .catch((e) => this.onError(e))



  }

//   view (rootFile, rootPath, fileMap) {
// debugger
//     if (this.viewer) this.viewer.clear();
//
//     const viewer = this.viewer || this.createViewer();
//
//     const fileURL = typeof rootFile === 'string'
//       ? rootFile
//       : URL.createObjectURL(rootFile);
//
//     const cleanup = () => {
//       this.hideSpinner();
//       if (typeof rootFile === 'object') URL.revokeObjectURL(fileURL);
//     };
//
//     viewer
//       .load(fileURL, rootPath, fileMap)
//       .catch((e) => this.onError(e))
//       .then(cleanup);
//
//     if (!this.options.kiosk) {
//       this.validationCtrl.validate(fileURL, rootPath, fileMap);
//     }
//   }

  /**
   * @param  {Error} error
   */
  onError (error) {
    if (error && error.target && error.target instanceof Image) {
      error = 'Missing texture: ' + error.target.src.split('/').pop();
    }
    window.alert((error||{}).message || error);
    console.error(error);
  }

  showSpinner () {
    this.spinnerEl.style.display = '';
  }

  hideSpinner () {
    this.spinnerEl.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const app = new App(document.body, location);

});

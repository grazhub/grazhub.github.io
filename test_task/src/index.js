import "../styles/styles.css";
import "../styles/normalize.css";
import TagsComponent from "./components.js";
// List of components (from components.js)
const components = {
  tags: TagsComponent
};

/* ----- spa init module --- */
const mySPA = (function() {

  class ModuleView {
    constructor (container) {
      this.moduleContainer = container;
      
      this.tagsComponent = this.moduleContainer.querySelector("#tagsComponent");
      this.input = this.tagsComponent.querySelector("input");
      this.addTagsButton = this.tagsComponent.querySelector(".button__add");
      this.tagsBox = this.tagsComponent.querySelector(".tags-box");
    }
    addAllTags(tagList) {
      for (let key in tagList) {
        this.addTag(tagList[`${key}`], key);
      }
    }
    removeTag(tag) {
      tag.remove();
    }
    addTag(tag, key) {      
      this.input.value = "";
      const tagContent = `<div class="tags-list__item" data-tag="${key}">
                            <span class="tags-list__item_text">${tag}</span>
                            <span class="material-icons">cancel</span>
                          </div>`;
      this.tagsBox.innerHTML += tagContent;
    }
    updateButtonState(state) {
      this.addTagsButton.disabled = state;
    }
  };

  class ModuleModel {
    constructor(view) {
      this.moduleView = view;
      this.readonly = false;
      this.tagList = {};
      this.tagListDefault = {
        1: "apple",
        2: "sony"
      };
    }
    getTagList() {
      this.tagList = !localStorage.getItem("tagList") ? this.tagListDefault : JSON.parse(localStorage.tagList);
      this.moduleView.addAllTags(this.tagList);
    }
    setTagList() {
      if(Object.keys(this.tagList).length === 0) {
        delete localStorage.tagList;
        return;
      }
      window.localStorage.setItem("tagList", JSON.stringify(this.tagList));
    }
    addTag(tag) {
      if (this.readonly || !tag) return;      
      let key = new Date().getTime();
      this.tagList[key] = tag;
      this.moduleView.addTag(tag, key);
    }
    removeTag(target, keyName) { 
      if (this.readonly || !target) return;        
      for (let key in this.tagList) {
        if (key === keyName) {          
          delete this.tagList[key];
        }
      }
      this.moduleView.removeTag(target);
    }
    checkInputValue(value) {
      const state = value ? false : true;
      this.moduleView.updateButtonState(state);
    }
    readonlyMode(state) {
      this.readonly = state;
    }
  }
  
  class ModuleController {
    constructor (container, model) {
      this.moduleContainer = container;
      this.tagsComponent = this.moduleContainer.querySelector("#tagsComponent");
      this.moduleModel = model;
      this.findAllTags();
      
    }
    findAllTags() {
      this.moduleModel.getTagList();
      this.bindEvents();
    }
    bindEvents() { 
      const tagsBox = this.tagsComponent.querySelector(".tags-box");
      const addButton = this.tagsComponent.querySelector(".button__add");
      const inputTag = this.tagsComponent.querySelector("#addTag");
      const readonly = this.tagsComponent.querySelector("#readonly");

      this.moduleModel.checkInputValue(inputTag.value);

      tagsBox.addEventListener("click", (e) => {
        const tag = e.target.closest(".tags-list__item");
        if (!tag) return;
        this.moduleModel.removeTag(tag, tag.dataset.tag);
      })

      addButton.addEventListener("click", () => {
        this.moduleModel.addTag(inputTag.value);
      })
      inputTag.addEventListener("input", () => {
        this.moduleModel.checkInputValue(inputTag.value);
      })
      readonly.addEventListener("change", () => {
        this.moduleModel.readonlyMode(readonly.checked)
      })
      window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        this.moduleModel.setTagList();
      })
    }
  };

  return {
      init: function({container, components}) {
          this.renderComponents(container, components);

          const view = new ModuleView(document.getElementById(container));
          const model = new ModuleModel(view);
          const controller = new ModuleController(document.getElementById(container), model);
      },

      renderComponents: function (container, components) {
        const root = document.getElementById(container);
        const componentsList = Object.keys(components);
        for (let item of componentsList) {
          root.innerHTML += components[item].render("component");
        }
      },
  };

}());
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init({
  container: "spa",
  components: components
}));


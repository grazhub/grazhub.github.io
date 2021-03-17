
const TagsComponent = {
  render: (customClass = "") => {
    return `
      <section class="${customClass}" id="tagsComponent">
        <div class="headline">
          <input type="text" id="addTag" placeholder="Add a tag"/>
          <button class="button button__add">Add a tag</button>
        </div>
        <div class="tags-box"></div>
        <div class="check">
          <input type="checkbox" id="readonly" name="readonly">
          <label for="readonly">Readonly mode</label>
        </div>
      </section>
    `;
  }
}
export default TagsComponent;

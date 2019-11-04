import { AppList } from './js/App'
import { loadEditor, removeEditor } from '@visualbi/vdt-editor';
export class App {
    private rootEl: HTMLElement;
    private treeContainer: HTMLElement;
    constructor(){
        this.rootEl = document.getElementById("filters");
        debugger;
    }
    public init(): void {
        this.treeContainer = document.createElement("div");
        this.treeContainer.classList.add("tree-container");
        this.rootEl.appendChild(this.treeContainer);
        this.renderVdtEditor();
    }

    renderVdtEditor() {
        // const editorConfiguration = this.getEditorConfiguration();
        // const options = { configurations: editorConfiguration, listener: this.onEditorPropertyChangeListener, getPropertyValue: this.getPropertyValue };
        // this.renderEditor(value);
        loadEditor(this.treeContainer, {});
    }

    removeVdtEditor() {
        removeEditor(this.treeContainer);
    }
}
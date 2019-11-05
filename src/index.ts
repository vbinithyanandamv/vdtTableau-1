import { AppList } from './js/App'
import { loadEditor, removeEditor } from '@visualbi/vdt-editor';
import { EditorProperties } from './settings';
import { TableauUtils } from './js/utils';
const Tableau = (window as any).tableau;
export class App {
    private rootEl: HTMLElement;
    private editorConatiner: HTMLElement;
    private editor: any;
    constructor() {
        this.rootEl = document.querySelector(".root");
        this.editor = new EditorProperties();
    }
    public init(): void {
        this.editorConatiner = document.createElement("div");
        this.editorConatiner.classList.add("editor-container");
        this.rootEl.appendChild(this.editorConatiner);
        this.render();
        this.setProperties();
        // this.renderVdtEditor();
    }

    private setProperties(): void {
            TableauUtils.setProperty("abc", "abc");
    }

    public renderVdtEditor() {
        const editorConfiguration = {
            globals: {
                instance: {
                    tree: {},
                    navPanel: {},
                    walkThrough: {}
                },
                data: () => { },
                multiSeriesDataParser: () => { },
                settings: {
                    isPBIDesktop: false,
                    setEditorOpen: false,
                    setTutorialStart: () => { },
                    isTutorialLoaded: () => { },
                    newTreeHandler: () => { },
                    setEditorStore: () => { },
                    properties: this.editor
                },
                launchUrl: ""
            }

        };
        loadEditor(this.editorConatiner, { configurations: editorConfiguration, listener: () => { }, getPropertyValue: () => { } });
    }

    public removeVdtEditor() {
        removeEditor(this.editorConatiner);
    }


    render() {
        const treeConf = {
            type: "tree",
            container: document.querySelector(".tree-container"),
            rootContainer: this.rootEl,
            properties: {}
        };

        const vdtComp = (window as any).Vdt.ComposeVisual.createVisual(treeConf);
        const navComp = (window as any).Vdt.ComposeVisual.createVisual({
            type: "navpanel",
            rootContainer: this.rootEl,
            container: document.querySelector(".nav-container"),
            properties: {
                valueDriverTree: vdtComp.id,
                constraintsList: ["1", "9"],
            }
        });
    }
}
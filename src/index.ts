import { AppList } from './js/App'
import { loadEditor, removeEditor } from '@visualbi/vdt-editor';
export class App {
    private rootEl: HTMLElement;
    private treeContainer: HTMLElement;
    constructor() {
        this.rootEl = document.getElementById("filters");
    }
    public init(): void {
        // this.renderVdtEditor();

        const root = document.querySelector(".root");
        const treeConf = {
            type: "tree",
            container: document.querySelector(".tree-container"),
            rootContainer: root,
            properties: {}
        };

        const vdtComp = (window as any).Vdt.ComposeVisual.createVisual(treeConf);
        const navComp = (window as any).Vdt.ComposeVisual.createVisual({
            type: "navpanel",
            rootContainer: root,
            container: document.querySelector(".nav-container"),
            properties: {
                valueDriverTree: vdtComp.id,
                constraintsList: ["1", "9"],
            }
        });



        /** Example of Event Subscription for all kinds of events */
        vdtComp.eventService.subscribe(vdtComp.id, '', printEvent);

        function printEvent(topic, selNode) {
            console.log(topic + " : " + JSON.stringify(selNode));
        }

        // navComp.eventService.subscribeOnce(
        //     navComp.id,
        //     "event:onCompareClick",
        //     () => {
        //        console.log("on compareclick");
        //     }
        // );

        function getConfig(confingStr) {
            const importedConfig = (window as any).Vdt.Utils.importConfig('', 'tree', confingStr);
            return importedConfig.properties;
        }
    }

    renderVdtEditor() {
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
                    properties: {}
                },
                launchUrl: ""
            }

        };
        // const options = { configurations: editorConfiguration, listener: this.onEditorPropertyChangeListener, getPropertyValue: this.getPropertyValue };
        // this.renderEditor(value);
        loadEditor(this.treeContainer, { configurations: editorConfiguration, listener: () => { }, getPropertyValue: () => { } });
    }

    removeVdtEditor() {
        removeEditor(this.treeContainer);
    }
}
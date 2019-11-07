import { AppList } from './js/App'
import { loadEditor, removeEditor } from '@visualbi/vdt-editor';
import { EditorProperties } from './settings';
import { TableauUtils } from './js/utils';
import { Tree, NavPanel } from '@visualbi/vdt';
import { WizBarRenderer  } from './WizBarRenderer'
import "@visualbi/vdt-editor/dist/css/combined.css"
import "./css/style.css"

const Tableau = (window as any).tableau;
export class App {
    private rootEl: HTMLElement;
    private navContainer: HTMLElement;
    private treeContainer: HTMLElement;
    private editorConatiner: HTMLElement;
    private editor: any;
    private unregisterFilterEventListener: Function;
    private unregisterMarkSelectionEventListener: Function;
    private worksheet: any = null;
    private treeComp: any = null;
    private navComp: any = null;
    private wizBarRenderer: any;
    private editorOpenAfterData: boolean;
    private changedProperties: any;
    private parseList = [
        "assumpList",
        "constraintsList",
        "kpiList",
        "periodsConfig",
        "scalesList",
        "topNodeList",
        "treeConfig",
        "valueDisplayList",
        "scenarios",
        "simBackup",
        "allocationSeriesStore",
        "allocationSeriesMeta",
        "allocationCellStates",
        "activeSeries",
        "allocationLogStore",
        "allocationLogArchive",
    ];
    constructor() {
        this.treeComp = null;
        this.navComp = null;
        this.unregisterFilterEventListener = null;
        this.unregisterMarkSelectionEventListener = null;
        this.rootEl = document.querySelector(".root");
        this.editor =  new EditorProperties();
        this.init();
    }


    private async init() {
        this.treeContainer = document.createElement("div");
        this.treeContainer.classList.add("tree-container");

        this.editorConatiner = document.createElement("div");
        this.editorConatiner.classList.add("editor-container");

        this.navContainer = document.createElement("div");
        this.navContainer.classList.add("nav-container");

        this.rootEl.appendChild(this.navContainer);
        this.rootEl.appendChild(this.treeContainer);
        this.rootEl.appendChild(this.editorConatiner);
        

        await Tableau.extensions.initializeAsync();
        this.setProperties();
        this.wizBarRenderer = new WizBarRenderer();
        Tableau.extensions.settings.saveAsync();
        this.render();
        this.registerSettingsChangeEventListener();
    }

    private registerSettingsChangeEventListener(): void {

        Tableau.extensions.settings.addEventListener(Tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
            this.render();
        });

        Tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function (parameters) {
            parameters.forEach(function (p) {
                p.addEventListener(Tableau.TableauEventType.ParameterChanged, (filterEvent) => {
                    this.render();
                });
            });
        });
    }

    private reRegisterEventListeners(): void {

        // Unregister Event Listeners for old Worksheet, if exists.
        if (this.unregisterFilterEventListener != null) {
            this.unregisterFilterEventListener();
        }
        if (this.unregisterMarkSelectionEventListener != null) {
            this.unregisterMarkSelectionEventListener();
        }
        if (this.worksheet && !this.worksheet.mock) {
            //Register New Event Listeners
            this.unregisterFilterEventListener = this.worksheet.addEventListener(Tableau.TableauEventType.FilterChanged, (filterEvent) => {
                this.render();
            });
            this.unregisterMarkSelectionEventListener = this.worksheet.addEventListener(Tableau.TableauEventType.MarkSelectionChanged, (markSelectionEvent) => {
                this.render();
            });
        }
    }

    getVisualComponentInstance = (comp: any): any => {

        if (comp == "tree") {
            return this.treeComp;
        } else if (comp == "nav") {
            return this.navComp;
        }
    }

    private setProperties(): void {
        Object.keys(this.editor).map(key => {
            if(this.editor[key] == null){
                this.editor[key]= ""
            }
            TableauUtils.setProperty(key, this.editor[key]);
        });
        // Tableau.extensions.settings.saveAsync();
    }

    

    public getPropertyValue = (property) => {
        if (!property || !property.sectionId || !property.propertyId) {
            return null;
        }
        const propertyValue = TableauUtils.getProperty(property.propertyId) || null;
        try {
            if (propertyValue && typeof propertyValue === "string") {
                const parsedValue = JSON.parse(propertyValue);
                if (typeof parsedValue === 'object' || typeof this.editor[property.propertyId] === 'boolean' || typeof this.editor[property.propertyId] === 'number') { // If the parsed is object then return parsed
                    return parsedValue;
                }

                return propertyValue;
            }
            return propertyValue;
        } catch (err) {
            return propertyValue;
        }

    }

    private onEditorPropertyChangeListener = (changes: any[] = []): void => {
        changes.map(({ change, meta }) => {
            if (!meta || !meta.propertyId) {
                return;
            }
            const propertyIds = [meta.propertyId];

            if (this.changedProperties && Array.isArray(this.changedProperties)) {
                this.changedProperties.push(meta.propertyId);

            } else {
                this.changedProperties = propertyIds;
            }
            let propertyValue = change.newValue;
            propertyValue = (typeof propertyValue === 'object') ? JSON.stringify(propertyValue) : propertyValue;
            TableauUtils.setProperty(meta.propertyId, propertyValue);
        });
        this.render();
    }

    public renderVdtEditor = () => {
        const configurations = {
            getVisualComponentInstance: this.getVisualComponentInstance,
            globals: {
                instance: {
                    tree: this.treeComp,
                    navPanel: this.navComp
                    //walkThrough: this.walkThrough
                },
                data: { dataView: {} },
                settings: {
                    isPBIDesktop: function () { return false },
                    setEditorOpen: function () { return true },
                    setTutorialStart: function () { return true },
                    isTutorialLoaded: function () { return false },
                    setEditorStore: () =>{},
                    newTreeHandler: this.newTreeHandler,
                    properties: this.editor
                }
            }

        }
        loadEditor(this.editorConatiner, { configurations: configurations, listener: this.onEditorPropertyChangeListener, getPropertyValue: this.getPropertyValue });
    }

    newTreeHandler = () => {
        if (this.treeComp) {
            if (typeof this.treeComp.apiService.newTreeHandler === "function") {
                this.treeComp.apiService.newTreeHandler();
            }
            /**
             * Any other actions that are outside the scope of VDTCore can be listed here
             */
        }
    }

    public removeVdtEditor= () => {
        removeEditor(this.editorConatiner);
    }

    private parseProps(updateConfig: any) {
        this.parseList.forEach((prop: string) => {
            if (updateConfig.hasOwnProperty(prop)) {
                try {
                    updateConfig[prop] = JSON.parse(updateConfig[prop]);
                } catch (e) { }
            }
        });
    }

    private getUpdateConfigForTree(editor, updateConfig: any = {}) {
        const changedProperties = this.changedProperties;
        const propsToUpdate = Array.isArray(changedProperties) && changedProperties.length > 0
            ? changedProperties : Object.keys((<any>window).Vdt.VdtDefaults.getTreeProps());
        propsToUpdate.map(key => {
            if (editor.hasOwnProperty(key)) {
                updateConfig[key] = editor[key];
            }
        });
        this.parseProps(updateConfig);
        if (updateConfig.hasOwnProperty("treeConfig")) {
            updateConfig.blankCanvas = updateConfig.treeConfig && updateConfig.treeConfig.length ? false : true;
            if (Array.isArray(updateConfig.treeConfig) && updateConfig.treeConfig.length === 0) {
                this.renderVdtEditor();
            }
        }
    }

    treeRenderer() {
        let updateConfig: any= {};
        const editor = TableauUtils.getAllProperty();
        this.getUpdateConfigForTree(editor, updateConfig);
        const pVerTitle = editor.pVerTitle;
        const cVerTitle = editor.cVerTitle;
        updateConfig.pVerTitle = pVerTitle || "Baseline";
        updateConfig.cVerTitle = cVerTitle || "Comparison";
        updateConfig.multiSeriesList = [{ "id": "act", "label": "Baseline", "seriesIndex": 0, "periodIndex": 0 }, { "id": "tgt", "label": "Comparison", "seriesIndex": 1, "periodIndex": 0 }, { "id": "Actual_17", "label": "Actual 17", "seriesIndex": 2, "periodIndex": 0 }, { "id": "Actual_18", "label": "Actual 18", "seriesIndex": 3, "periodIndex": 0 }];
        if (!this.treeComp) {
            this.treeComp = (<any>window).Vdt.ComposeVisual.createVisual({
                type: "tree",
                container: this.treeContainer as HTMLElement,
                rootContainer: this.rootEl as HTMLElement,
                properties: updateConfig,
            }) as Tree;
            // this.treeComp.eventService.subscribe(this.treeComp.id, "propsChanged", this.firePropsChanged);
        } else {
            this.treeComp.updateProps(updateConfig);
        }
    }

    
    navPanelRenderer(){
        const editor = TableauUtils.getAllProperty();

        const navPanelConfig: any = {};
        const nav = (<any>window).Vdt.VdtDefaults.getNavPanelProps();
        Object.keys(nav).map(key => {
            navPanelConfig[key] = editor[key];
        });
        this.parseProps(navPanelConfig);

        if (navPanelConfig.enableNavPanel) {

            /** If navigation panel is enabled and the container display is hidden, we adjust the containers */
            if (this.navContainer.style.display !== "block") {
                this.navContainer.style.display = "block";
                this.treeContainer.style.left = "320px";
            }

            /**
             * Since this property is not coming from editor, we need to manually set it
             * after we have consumed properties from editor.
             */
            navPanelConfig.valueDriverTree = this.treeComp.id;
            if (!this.navComp) {
                this.navComp = (<any>window).Vdt.ComposeVisual.createVisual({
                    type: "navpanel",
                    container: this.navContainer as HTMLElement,
                    properties: navPanelConfig,
                }) as NavPanel;

                // this.walkThrough.setNavComp(this.navComp);
            } else {
                this.navComp.updateProps(navPanelConfig);
            }

        } else {

            /** Remove Navigation Panel Component */
            if (this.navComp) { this.navComp.remove(); }

            /** Remove Navigation Panel Container and Resize Tree Container */
            this.navContainer.style.display = "none";
            this.treeContainer.style.left = "0px";
            this.navComp = null;
        }
    }
    onHelpIconClick = () => {
        document.getElementById("helpBtn").click();
    }

    render() {
        const editor = TableauUtils.getAllProperty();
        this.treeRenderer();
        this.navPanelRenderer();
        if(Tableau.extensions.settings){
            if (!this.editorOpenAfterData) {
                this.renderVdtEditor();
                this.editorOpenAfterData = true;
            }
        }
        const isTreePresent = this.treeComp ? this.treeComp.props.treeConfig.length > 0 : false;
        this.wizBarRenderer.render({ isTreePresent: isTreePresent, inEditMode:  true, withComparison: editor.withComparison, container: this.rootEl, treeComp: this.treeComp, launchURL: "", launchSyncTab: this.wizBarRenderer, renderEditor: () => this.renderVdtEditor(), removeEditor: () => this.removeVdtEditor(), onHelpIconClick: this.onHelpIconClick });
    }
}
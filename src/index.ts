import { AppList } from './js/App'
import { loadEditor, removeEditor } from '@visualbi/vdt-editor';
import { EditorProperties } from './settings';
import { TableauUtils } from './js/utils';
import "@visualbi/vdt-editor/dist/css/combined.css"
const Tableau = (window as any).tableau;
export class App {
    private rootEl: HTMLElement;
    private editorConatiner: HTMLElement;
    private editor: any;
    private unregisterFilterEventListener: Function;
    private unregisterMarkSelectionEventListener: Function;
    private worksheet: any = null;
    private vdtComp: any = null;
    private navComp: any = null;
    constructor() {
        this.vdtComp = null;
        this.navComp = null;
        this.unregisterFilterEventListener = null;
        this.unregisterMarkSelectionEventListener = null;
        this.rootEl = document.querySelector(".root");
        this.editor = {...(<any>window).Vdt.VdtDefaults.getTreeProps(), ...(<any>window).Vdt.VdtDefaults.getNavPanelProps()}
        this.init();
    }


    private async init() {
        this.editorConatiner = document.createElement("div");
        this.editorConatiner.classList.add("editor-container");
        this.rootEl.appendChild(this.editorConatiner);
        await Tableau.extensions.initializeAsync();
        this.setProperties();
        Tableau.extensions.settings.saveAsync();
        this.render();
        this.registerSettingsChangeEventListener();
    }

    private registerSettingsChangeEventListener(): void {

        Tableau.extensions.settings.addEventListener(Tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
            console.log(settingsEvent);
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
            return this.vdtComp;
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

    private onEditorPropertyChangeListener(changes: any[] = []): void {
        const updateProperties = [];
        console.log(Tableau.extensions.settings.getAll());
        changes.map(({ change, meta }) => {
            if (!meta || !meta.propertyId) {
                return;
            }
            const propertyIds = [meta.propertyId];
            const windowRef = (window as any);

            if (windowRef._BIFROST_VISUAL && Array.isArray(windowRef._BIFROST_VISUAL._changedProperties)) {
                (window as any)._BIFROST_VISUAL._changedProperties.push(meta.propertyId);

            } else {
                (window as any)._BIFROST_VISUAL = {
                    _changedProperties: propertyIds
                };
            }

            let propertyValue = change.newValue;
            propertyValue = (typeof propertyValue === 'object') ? JSON.stringify(propertyValue) : propertyValue;
            TableauUtils.setProperty(meta.propertyId, propertyValue);
        });
    }

    public renderVdtEditor() {
        const configurations = {
            getVisualComponentInstance: this.getVisualComponentInstance,
            globals: {
                instance: {
                    tree: this.vdtComp,
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
                    properties: this.editor
                }
            }

        }
        loadEditor(this.editorConatiner, { configurations: configurations, listener: this.onEditorPropertyChangeListener, getPropertyValue: this.getPropertyValue });
    }

    public removeVdtEditor() {
        removeEditor(this.editorConatiner);
    }
    renderVDT(){

        if(!this.vdtComp) {
            const treeConf = {
                type: "tree",
                container: document.querySelector(".tree-container"),
                rootContainer: this.rootEl,
                properties: {}
            };
    
            this.vdtComp = (window as any).Vdt.ComposeVisual.createVisual(treeConf);
        }
        
        if(!this.navComp) {
            this.navComp = (window as any).Vdt.ComposeVisual.createVisual({
                type: "navpanel",
                rootContainer: this.rootEl,
                container: document.querySelector(".nav-container"),
                properties: {
                    valueDriverTree: this.vdtComp.id,
                    constraintsList: ["1", "9"],
                }
            });
        }
        
    }


    render() {
        this.renderVDT();
        console.log(Tableau.extensions.settings ? Tableau.extensions.settings : null);
        if(Tableau.extensions.settings){
            this.renderVdtEditor(); 
        }
        
        
        
    }
}
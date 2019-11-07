import { loadWizBarRenderer, Router } from '@visualbi/vdt-wizbar';
export enum WizTabs  {
    MODEL = "MODEL",
    PLAN = "PLAN",
    SIMULATE = "SIMULATE",
    ANALYZE = "ANALYZE"
}
interface SelectedPanel {
    "selected": WizTabs;
    "state"?: any;
    "children": {
        "selected"?: string;
        "state"?: any;
    };
}
export class WizBarRenderer {
    private visual: any;
    private selectedTab: SelectedPanel;
    private subscriptionMethodSeries: any;
    private subscriptionTriggerAllocation: any;
    private wizBarRef: any;
    private router: any;
    constructor() {
        this.subscriptionMethodSeries = null;
        this.subscriptionTriggerAllocation = null;
        this.wizBarRef = null;
        this.selectedTab =  {
            selected: WizTabs.SIMULATE,
            state: "",
            children: {
                selected: "",
                state: ""
            }
        };
        this.router = new Router(WizTabs.MODEL, [
            this.getPlanningRoute(),
            this.getSimulateRoute(),
            this.getModelRoute(),
            this.getAnalyzeRoute()
        ]);
    }
    private onNavigate = ({key, state}) => {
        this.router.navigate(key, state);
        this.selectedTab =  {
            selected: key,
            state: "",
            children: state.children
        };
    }
    private getPlanningRoute = () => {
        return {
            key: WizTabs.PLAN,
            onLoad:  ({nodeName}) => {
                this.visual.treeComp.apiService.triggerAllocation(nodeName || "");
                return Promise.resolve();
            },
            onUnload: () => {
                this.visual.treeComp.apiService.unloadAllocationsEditor();
                return Promise.resolve();
            }
        };
    }
    private getModelRoute = () => {
        return {
            key: WizTabs.MODEL,
            onLoad: () => {
                if (this.visual.inEditMode) this.visual.renderEditor({});
                return Promise.resolve();
            },
            onUnload: () => {
                if (this.visual.inEditMode) {
                    this.visual.treeComp.apiService.unloadSimulateModal();
                    this.visual.removeEditor();
                }
                return Promise.resolve();
            }
        };
    }
    private getAnalyzeRoute = () => {
        return {
            key: WizTabs.ANALYZE,
            onLoad: ({children}) => {
                if (children.selected === "variance") {
                    this.visual.treeComp.apiService.triggerVariance();
                }
                return Promise.resolve();
            },
            onUnload: ({children}) => {
                if (children.selected === "variance") {
                    this.visual.treeComp.apiService.unloadVarianceEditor();
                }
                return Promise.resolve();
            }
        };
    }
    private getSimulateRoute = () => {
        return {
            key: WizTabs.SIMULATE,
            onLoad: () => { return Promise.resolve(); },
            onUnload: () => {
                this.visual.treeComp.apiService.unloadSimulateModal();
                return Promise.resolve();
            }
        };
    }
    private setSelectedSeries = (value: string, selectedProp: string) => {
        if (selectedProp === 'isPrimary') {
            this.visual.treeComp.apiService.TreeRef.seriesManager.makePrimary(value);
        } else if (selectedProp === 'isComparison') {
            this.visual.treeComp.apiService.TreeRef.seriesManager.makeComparison(value);
        }
    }
    private getSeriesList(): any[] {
        return this.visual.treeComp.apiService.TreeRef.seriesManager.getSeriesList();
    }
    private setWizBarRef = (ref) => {
        this.wizBarRef = ref;
    }
    public render(visual: any) {
        this.visual = visual;
        // const treeLimitExceed = document.getElementById("valq_license_breach") ? false : true;
        if (!visual.inEditMode  && this.selectedTab.selected === WizTabs.MODEL) {
            // this.selectedTab = {selected: WizTabs.SIMULATE, state: {}, children: {}};
            this.onNavigate({key: WizTabs.SIMULATE, state: {}});
        }
        if (!visual.isTreePresent) {
            // this.loadTabs({selected: WizTabs.MODEL, state: {}, children: {}});
            this.onNavigate({key: WizTabs.MODEL, state: {}});
        }
        if (!this.subscriptionMethodSeries) {
            this.subscriptionMethodSeries = this.visual.treeComp.apiService.TreeRef.eventService.subscribe(this.visual.treeComp.apiService.TreeRef.id, "seriesUpdated", () => {
                this.render(this.visual);
            });
        }
        if (!this.subscriptionTriggerAllocation) {
            this.subscriptionTriggerAllocation = this.visual.treeComp.apiService.TreeRef.eventService.subscribe(this.visual.treeComp.apiService.TreeRef.id, "triggerAllocation", (node, data) => {
                // this.loadTabs({selected: WizTabs.PLAN, state: {nodeName: data.nodeName}, children: {}});
                this.onNavigate({key: WizTabs.PLAN, state: {nodeName: data.nodeName, children: {}}});
                this.wizBarRef.switchTabs(WizTabs.PLAN);
            });
        }
        const isTreePresent =  this.visual.isTreePresent; // checking tree limit exceeded or not
        loadWizBarRenderer({ setWizBarRef: this.setWizBarRef, onHelpIconClick: this.visual.onHelpIconClick, isTreePresent: isTreePresent, inEditMode: this.visual.inEditMode, launchURL: this.visual.launchUrl, launchSyncTab: this.visual.launchSyncTab, withComparison: this.visual.withComparison, onNavigate: this.onNavigate, selectedTab: this.selectedTab.selected, getSeriesList: this.getSeriesList.bind(this), setSelectedSeries: this.setSelectedSeries}, visual.container);
    }
}
import { AppList } from './js/App'
import { loadEditor, removeEditor } from '@visualbi/vdt-editor';
import { DataParser } from './dataParser';
const Tableau = (window as any).tableau;

declare global {
    interface Window  { Tableau: any; }
}
export class App {
    private rootEl: HTMLElement;
    private treeContainer: HTMLElement;
    private unregisterFilterEventListener:Function;
    private worksheet:any;
    private dataParser:any;


    constructor() {
        this.rootEl = document.getElementById("filters");
        this.unregisterFilterEventListener = null;
        this.worksheet = null;
        this.dataParser = new DataParser;
    }

        configure() {

    }


    public init(): void {
        // this.renderVdtEditor();

        let self = this;
        Tableau.extensions.initializeAsync().then(function() { 
            
            const worksheet = Tableau.extensions.dashboardContent.dashboard.worksheets[0];

            let extensionVisibilityObject = {};

            Tableau.extensions.dashboardContent.dashboard.objects.forEach(function(object){
                if(object.type === 'worksheet' ){
                    extensionVisibilityObject[object.id] = Tableau.ZoneVisibilityType.Hide;
                }
            }); 

            Tableau.extensions.dashboardContent.dashboard.setZoneVisibilityAsync(extensionVisibilityObject).then(() => {
                console.log("Hidden the remaining objects");
            })
                 
           worksheet.getSummaryDataAsync().then(function (data) {
                 let options = {
                     'dataType':'with_actual_data',
                     'category':["Category","Region"],
                     'timePeriod':"Time Period - Month",
                     'values':["SUM(Sum of Sales Forecast)","SUM(Sum of Sales Budget)"]
                 }
                 let parsedData = self.dataParser.convertData(options,data);
                 let vdtConfig = {"data":{"periods":[{"id":"1","label":"1"}],"rows":[{"id":"Sales Budget","label":"Sales Budget","series":[[504072018.00000006]]}],"metadata":{"periods":[[{"id":"1","label":"1"}]],"series":[]}},"sourceRef":"","configServerMap":[],"PeriodColumn":1,"PeriodToColumn":12,"primaryDisplayValue":"total","visualization":"Tree","tableStyle":"S","tableCellAlignment":"C","scale":"0m","scaleSuffixK":"k","scaleSuffixM":"m","scaleSuffixB":"b","scaleSuffixT":"t","PctVarAmber":0,"PctVarGreen":0,"PctVarRed":-10,"nodeMapping":"text","nodeMappingSep":":","zeroDisplay":"","negativeDisplay":"(0)","useConstants":true,"activeTopNode":"","dispLevels":2,"dispChildCount":false,"zoom":100,"waterFallType":"V","hint":"Hint: Hover over a node and drag the slider left or right to simulate changes","onClickDefault":"E","nodeStyle":"S","nodeTrend":true,"nodeVar":true,"nodeSecVal":true,"nodeOperand":true,"nodeStatus":"V","withComparison":true,"periods":12,"periodsLabels":"Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec","multiSeriesList":[{"id":"act","uniqueId":"1","label":"Baseline","seriesIndex":0,"periodIndex":0},{"id":"tgt","uniqueId":"tgt","label":"Comparison","seriesIndex":-1,"periodIndex":-1}],"pVerTitle":"Baseline","cVerTitle":"Comparison","valTextSper":"Mth","valTextLper":"Month","valTextSptd":"YtD","valTextLptd":"YtD","valTextStotal":"FY","valTextLtotal":"Full Year","valTextSsel":"Sim","valTextLsel":"Sim.Mths","secValDispper":"total","secValDispptd":"total","secValDisptotal":"per","secValDispsel":"total","colorNodePrimaryFont":"#000000","colorNodeSecondaryFont":"#777777","colorSim":"#2E8AB8","colorNodeBg":"#FFFFFF","opacityNodeBg":"0.9","colorNodeBorder":"#000000","opacityNodeBorder":"0.2","colorNodeBgDerived":"#FFFFFF","opacityNodeBgDerived":"0.3","colorLinks":"#666666","colorNodeBorderFocus":"#2E8AB8","colorCanvasBase":"#E2E8EF","colorCanvas1":"#C5DADC","colorCanvas2":"#91ABBF","colorCanvas3":"#CFDDE7","exportMode":"SCRIPT","exportUrl":"","decimalSeparator":".","thousandSeparator":",","treeConfig":[{"aMeth":"S","cfRuleId":0,"cfApplyToDescendants":false,"cfType":"G","cfMax":0,"cfMid":0,"cfMin":-10,"cfValueType":"percentage","cfMinColor":"#FF0000","cfMidColor":"#FFBF00","cfInterColor":"#FFFFFF","cfMaxColor":"#008000","cMeth":"","dec":0,"derived":"","deriveChildren":true,"derivedSim":"","descr":"","detailPageType":"DEFAULT","footer":"","formula":"","header":"","hideStatus":"","lSimNode":"","level":0,"linkNode":"","locked":"","manAct":"","manTgt":"","max":null,"min":null,"name":"SUMME","noDetail":"","notes":"","prefix":"","sMeth":"P","scale":"X","style":"","suffix":"","tPrefix":"","title":"Overall Result","tmplNode":"","tmplPrefix":"","tmplTPrefix":"","trend":"X","rowMap":"","wAvgNode":""}],"scenarios":[{"name":"1","title":"Scenario 1","descr":"","defaultDescr":"","compare":true,"simVar":[]}],"nodesToExport":[],"selectedNode":null,"clickedPeriod":null,"activeScenario":"1","focusNode":"","enableNodeSearch":true,"hideEmptyNodes":false,"blankCanvas":false,"disableDownload":false};
                 vdtConfig.data = parsedData;

                const root = document.querySelector(".root");
                    const treeConf = {
                    type: "tree",
                    container: document.querySelector(".tree-container"),
                    rootContainer: root,
                    properties: vdtConfig
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

                vdtComp.tree

            })

        });

            // const root = document.querySelector(".root");
            //         const treeConf = {
            //         type: "tree",
            //         container: document.querySelector(".tree-container"),
            //         rootContainer: root,
            //         properties: {
                        
            //         }
            //         };

            //         const vdtComp = (window as any).Vdt.ComposeVisual.createVisual(treeConf);

            //         const navComp = (window as any).Vdt.ComposeVisual.createVisual({
            //         type: "navpanel",
            //         rootContainer: root,
            //         container: document.querySelector(".nav-container"),
            //         properties: {
            //             valueDriverTree: vdtComp.id,
            //             constraintsList: ["1", "9"],
            //         }
            //     });

            // })

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
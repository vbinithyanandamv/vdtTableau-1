/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
import { NS_Tree } from '@visualbi/vdt';
const props = (<any>window).Vdt.VdtDefaults.getTreeProps();
const nav = (<any>window).Vdt.VdtDefaults.getNavPanelProps();

const extend = (obj, src): any => {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}
const property: any = extend(nav, props);

"use strict";
export class ValqServer {
    public treeIdNameMap: string = JSON.stringify({});
    public scenarioIdNameMap: string = JSON.stringify({});
}

export class EditorProperties {
    public periodsConfig: string = "{}";
    public seriesGenerationMethod: string = ""; // does not come from VDT Core
    public data: NS_Tree.ITreeData = property.data;
    public sourceRef: string = property.sourceRef;
    public configServerMap: NS_Tree.IConfigServer[] = property.configServerMap;
    public PeriodColumn: number = property.PeriodColumn;
    public PeriodToColumn: number = property.PeriodToColumn;
    public primaryDisplayValue: string = property.primaryDisplayValue;
    public visualization: string = property.visualization;
    public tableStyle: string = property.tableStyle;
    public tableCellAlignment: string = property.tableCellAlignment;
    public scale: string = "0k";
    public scaleSuffixK: string = property.scaleSuffixK;
    public scaleSuffixM: string = property.scaleSuffixM;
    public scaleSuffixB: string = property.scaleSuffixB;
    public scaleSuffixT: string = property.scaleSuffixT;
    public PctVarAmber: number = property.PctVarAmber;
    public PctVarGreen: number = property.PctVarGreen;
    public PctVarRed: number = property.PctVarRed;
    public nodeMapping: string = property.nodeMapping;
    public nodeMappingSep: string = property.nodeMappingSep;
    public zeroDisplay: string = property.zeroDisplay;
    public negativeDisplay: string = property.negativeDisplay;
    public useConstants: boolean = property.useConstants;
    public enableNodeSearch: boolean = property.enableNodeSearch;
    public activeTopNode: string = property.activeTopNode;
    public dispLevels: number = property.dispLevels;
    public dispChildCount: boolean = property.dispChildCount;
    public zoom: number = property.zoom;
    public waterFallType: string = property.waterFallType;
    public hint: string = property.hint;
    public onClickDefault: string = property.onClickDefault;
    public nodeStyle: string = property.nodeStyle;
    public nodeTrend: boolean = property.nodeTrend;
    public nodeVar: boolean = property.nodeVar;
    public nodeSecVal: boolean = property.nodeSecVal;
    public nodeOperand: boolean = property.nodeOperand;
    public nodeStatus: string = property.nodeStatus;
    public withComparison: boolean = property.withComparison;
    public periods: number = property.periods;
    public periodsLabels: string = property.periodsLabels;
    public enableActivePeriod: boolean = false;
    public periodColumnType: string = "month";
    public pVerTitle: string = "";
    public cVerTitle: string = "";
    public valTextSper: string = property.valTextSper;
    public valTextLper: string = property.valTextLper;
    public valTextSptd: string = property.valTextSptd;
    public valTextLptd: string = property.valTextLptd;
    public valTextStotal: string = property.valTextStotal;
    public valTextLtotal: string = property.valTextLtotal;
    public valTextSsel: string = property.valTextSsel;
    public valTextLsel: string = property.valTextLsel;
    public secValDispper: string = property.secValDispper;
    public secValDispptd: string = property.secValDispptd;
    public secValDisptotal: string = property.secValDisptotal;
    public secValDispsel: string = property.secValDispsel;
    public colorNodePrimaryFont: string = property.colorNodePrimaryFont;
    public colorNodeSecondaryFont: string = property.colorNodeSecondaryFont;
    public colorSim: string = property.colorSim;
    public colorNodeBg: string = property.colorNodeBg;
    public opacityNodeBg: string = property.opacityNodeBg;
    public colorNodeBorder: string = property.colorNodeBorder;
    public opacityNodeBorder: string = property.opacityNodeBorder;
    public colorNodeBgDerived: string = property.colorNodeBgDerived;
    public opacityNodeBgDerived: string = property.opacityNodeBgDerived;
    public colorNodeBgComposite: string = property.colorNodeBgComposite;
    public opacityNodeBgComposite: string = property.opacityNodeBgComposite;
    public colorLinks: string = property.colorLinks;
    public colorNodeBorderFocus: string = property.colorNodeBorderFocus;
    public colorCanvasBase: string = property.colorCanvasBase;
    public colorCanvas1: string = property.colorCanvas1;
    public colorCanvas2: string = property.colorCanvas2;
    public colorCanvas3: string = property.colorCanvas3;
    public exportMode: string = property.exportMode;
    public exportUrl: string = property.exportUrl;
    public decimalSeparator: string = property.decimalSeparator;
    public thousandSeparator: string = property.thousandSeparator;
    // public customDefaultDetailPageRef: string = property.customDefaultDetailPageRef;
    // public isEditModeAllowed: boolean = property.isEditModeAllowed;
    public treeConfig: string = JSON.stringify([]);
    public lockTreeConfig: boolean = property.lockTreeConfig || false;
    // public externalConfig: NS_Tree.IExternalConfig = property.externalConfig;
    public nodesToExport: any[] = property.nodesToExport;
    public selectedNode: {} = property.selectedNode;
    public clickedPeriod: NS_Tree.IClickedPeriod = property.clickedPeriod;
    public focusNode: string = property.focusNode;
    // public deltaConfig: string = property.deltaConfig;
    // public ztlEdits: {} = property.ztlEdits;
    // public treeConfigBackup: string = property.treeConfigBackup;
    // public onNodeClick: () => void = property.onNodeClick;
    // public onSimulation: () => void = property.onSimulation;
    public valueDriverTree: string = property.valueDriverTree;
    public showTitles: boolean = property.showTitles;
    public topNodeVisibility: string = property.topNodeVisibility;
    public assumpVisibility: string = property.assumpVisibility;
    public kpiVisibility: string = property.kpiVisibility;
    public valueDisplayVisibility: string = property.valueDisplayVisibility;
    public periodsVisibility: string = property.periodsVisibility;
    public scenariosVisibility: string = property.scenariosVisibility;
    public constraintsVisibility: string = property.constraintsVisibility;
    public visualizationVisibility: string = property.visualizationVisibility;
    public scenariosTitle: string = property.scenariosTitle;
    public topNodeTitle: string = property.topNodeTitle;
    public assumpTitle: string = property.assumpTitle;
    public kpiTitle: string = property.kpiTitle;
    public valueDisplayTitle: string = property.valueDisplayTitle;
    public periodsTitle: string = property.periodsTitle;
    public constraintsTitle: string = property.constraintsTitle;
    public visualizationTitle: string = property.visualizationTitle;
    public multiSeriesList: string = "[]"
    public constraintsSort: boolean = property.constraintsSort;
    public topNodeList: string = JSON.stringify(property.topNodeList || []);
    public kpiList: string = JSON.stringify(property.kpiList || []);
    public assumpList: string = JSON.stringify(property.assumpList || []);
    public valueDisplayList: string = JSON.stringify(property.valueDisplayList || []);
    public scalesList: string = JSON.stringify(property.scalesList || []);
    public constraintsList: string = JSON.stringify(property.constraintsList || []);
    public theme: string = property.theme;
    public filterLists: boolean = property.filterLists;
    // public onCompareClick: (args: any) => void = property.onCompareClick;
    // public onShowEditInputsClick: (args: any) => void = property.onShowEditInputsClick;
    public enableNavPanel: boolean = property.enableNavPanel;
    public scenarios: string = JSON.stringify([{ "name": "1", "title": "Scenario 1", "descr": "", "defaultDescr": "", "compare": true, "simVar": [] }]);
    public activeScenario: string = '1';
    public license: string = '';
    public hideEmptyNodes: boolean = property.hideEmptyNodes;
    public simBackup: string = null;
    public allocationSeriesStore: string = property.allocationSeriesStore ? JSON.stringify(property.allocationSeriesStore) : undefined;
    public allocationSeriesMeta: string = property.allocationSeriesMeta ? JSON.stringify(property.allocationSeriesMeta) : undefined;
    public allocationCellStates: string = property.allocationCellStates ? JSON.stringify(property.allocationCellStates) : undefined;
    public activeSeries: string = property.activeSeries ? JSON.stringify(property.activeSeries) : undefined;
    public allocationLogStore: string = property.allocationLogStore ? JSON.stringify(property.allocationLogStore) : undefined;
    public allocationLogArchive: string = property.allocationLogArchive ? JSON.stringify(property.allocationLogArchive) : undefined;
}

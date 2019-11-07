import { PeriodParser } from "./periodParser";

export class DataParser {

    constructor() {
    }

    private static transformPeriodData = (options,tableauData) => {
        let categoryData :any = new Map();
        let periods = [];
        let periodsObj = [];
        let periodDetector = new PeriodParser();

        //create data map here
        let dataMapConfig = {
            'hierMap':{},
            'timePeriod':0,
            'series':{}
        };

        //periods
        let findColumnIndex = (field,index,columnMap) => {
             for(let i=0;i<tableauData._columns.length;i++){
                if(tableauData._columns[i]._fieldName === field){
                    if(index !== undefined && index !== null){
                        dataMapConfig[columnMap][index] = i;
                    }else{
                        dataMapConfig[columnMap] = i;
                    }
                }
            }
        }

        options.category.map((field,index) => {
            findColumnIndex(field,index,'hierMap')
        });

        options.values.map((field,index) => {
            findColumnIndex(field,index,'series')
        });

        findColumnIndex(options.timePeriod,null,'timePeriod')

        console.log(dataMapConfig);
       
        //can be limited based on number of periods
        for (var i = 0; i < tableauData._data.length; i++) {
             const data =tableauData._data[i];
            if (!periods.some(period => period === data[dataMapConfig.timePeriod]._value)) {
                periods.push(data[dataMapConfig.timePeriod]._value)
            }
        }

        let periodOrder : any = periodDetector.getSortedOrder(periods);
        let numberOfPeriods = periods.length; //can be get from editor also
        let categoryIndex = dataMapConfig.hierMap;
        let seriesIndex = dataMapConfig.series;
        let timePeriodIndex = dataMapConfig.timePeriod;

        tableauData._data.map(data => {            
            
            /**
             based on number of category
             for example 
             Country,Region level should start with 0 (root already handled and we add children based on level 
             which will be 0 hence add one level and decrement level will be -1 no more child)
             Country,Region,Rep level should start with 1 (root already handled and level will be 1 add region decrement
             level will be 0, add rep and decrement level will be -1 no more child)
            **/ 
            let level = options.category.length - 2; 

            if (!categoryData.has(data[categoryIndex[0]]._value)) {
                //First add root
                categoryData.set(data[categoryIndex[0]]._value, {
                    id: data[categoryIndex[0]]._value,
                    label: data[categoryIndex[0]]._formattedValue,
                    children: new Map(),
                    series: [[], []],
                    parent: null
                });
            }

            let addChildren = (parent, children) => {
                //then add children recursively and form the structure
                if (level < 0) {
                    return parent;
                }
                if (!parent.children.has(children._value)) {
                    parent.children.set(children._value, {
                        id: children._value,
                        label: children._formattedValue,
                        children: new Map(),
                        series: [],
                        parent: parent
                    });
                }
                level--;
                parent = parent.children.get(children._value);
                return addChildren(parent, data[dataMapConfig.hierMap[level]]);
            };

            let leafChildren = addChildren(categoryData.get(data[categoryIndex[0]]._value), data[categoryIndex[1]]);

            //update data from children to parent
            let updateData = (node) => {
                node.series[0] = !node.series[0] ? [] : node.series[0];
                let periodValueIndex = periodOrder.indexOf(data[timePeriodIndex]._value.toLowerCase());
                if (!node.series[0][periodValueIndex]) {
                    node.series[0][periodValueIndex] = data[seriesIndex[0]]._value;
                    if (options.dataType !== "single_measure") {
                        node.series[1] = !node.series[1] ? [] : node.series[1];
                        node.series[1][periodValueIndex] = data[seriesIndex[1]]._value;
                    }
                } else {
                    node.series[0][periodValueIndex] = node.series[0][periodValueIndex] + data[seriesIndex[0]]._value;
                    if (options.dataType !== "single_measure") {
                        node.series[1][periodValueIndex] = node.series[1][periodValueIndex] + data[seriesIndex[1]]._value;
                    }
                }
                if (node.parent) {
                    updateData(node.parent);
                }
            };

            updateData(leafChildren);
        });

        //convert to VDT DATA Format
        categoryData = Array.from(categoryData.values());

        categoryData.map(node => {
            let maptoArray = node => {
                node.children = Array.from(node.children.values());
                if (!node.children) {
                    return;
                }
                delete node.parent;
                node.children.map(node => {
                    maptoArray(node);
                });
            };
            maptoArray(node);
        });

        let seriesNames = [];

        for (var i = 0; i < tableauData._data.length; i++) {
             const data =tableauData._data[i];
             let periodData = {
                id: data[timePeriodIndex]._value,
                label: data[timePeriodIndex]._formattedValue
            };
            if (!periodsObj.some(period => period.id === data[timePeriodIndex]._value)) {
                periodsObj[periodOrder.indexOf(data[timePeriodIndex]._value.toLowerCase())] = periodData
            }
        }


        if (options.dataType == "single_measure") {
            seriesNames = [tableauData._columns[seriesIndex[0]]._fieldName];
        } else {
            seriesNames = [
                tableauData._columns[seriesIndex[0]]._fieldName,
                tableauData._columns[seriesIndex[1]]._fieldName
            ];
        }

        let props = {
            periods: periodsObj,
            rows: categoryData,
            metadata: {
                periods: periodsObj,
                series: seriesNames
            }
        };

        return props;
    };

    private static transformnoPeriodData = (tableauData) => {
        let period_length = tableauData._columns.length - 1; //dimension length
        let number_of_periods = 12; //should be coming from editor
        let number_of_series = period_length / number_of_periods;
        let rows = new Map();
        let periods = [];
        let i;

        //get periods
        for (i = 1; i <= period_length; i++) {
            //i == count should be number of dimension
            periods.push(tableauData._columns[i]._fieldName);
        }

        tableauData._data.map(row_data => {
            if (!rows.has(row_data[0]._value)) {
                //First add root
                rows.set(row_data[0]._value, {
                    id: row_data[0]._value,
                    label: row_data[0]._formattedValue,
                    series: []
                });
            }
            //update data based on periods
            let i;
            for (i = 1; i <= period_length; i++) {
                //i == count should be number of dimension
                let seriesIndex = Math.ceil(i / 12) - 1;
                let currentRow = rows.get(row_data[0]._value);
                currentRow.series[seriesIndex] = currentRow.series[seriesIndex] ?
                    currentRow.series[seriesIndex] :
                    [];
                currentRow.series[seriesIndex].push(row_data[i]._value);
            }
        });

        let props = {
            periods: [{
                id: "1",
                label: "1"
            }],
            rows: Array.from(rows.values()),
            metadata: {
                periods: periods,
                series: []
            }
        };
        
        return props;
    };
    public convertData = (options,data) => {
        let TableauData = data;
        //series should be based on number of measures
        if (options.dataType === "with_actual_data" || options.options.dataType === "single_measure") {
            return DataParser.transformPeriodData(options,TableauData)
        }else if (options.dataType === "no_periods") {
            return DataParser.transformnoPeriodData(TableauData)
        }
    };
}
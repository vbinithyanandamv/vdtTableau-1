const props = (<any>window).Vdt.VdtDefaults.getTreeProps();
const nav = (<any>window).Vdt.VdtDefaults.getNavPanelProps();

const property = {
    ...props,
    ...nav
};

export class AppList {
    public init(): void {

        console.log("new data adtata", property);
    }
}
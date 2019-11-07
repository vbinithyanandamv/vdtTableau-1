export class TableauUtils{
     static getProperty(property){
        if ((window as any).tableau.extensions.settings) {
            return (window as any).tableau.extensions.settings.get(property);
        }
        return null;
    }
     static setProperty(property,value){
        if ((window as any).tableau.extensions.settings) {
            (window as any).tableau.extensions.settings.set(property,value);
        }
        return null;
    }
    static getAllProperty(){
        if ((window as any).tableau.extensions.settings) {
            return (window as any).tableau.extensions.settings.getAll();
        }
        return null;
    }
}

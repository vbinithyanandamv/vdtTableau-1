export class TableauUtils{
     static getProperty(property){
        return (window as any).tableau.extensions.settings.get(property);
    }
     static setProperty(property,value){
        (window as any).tableau.extensions.settings.set(property,value);
         return (window as any).tableau.extensions.settings.saveAsync();
    }
}

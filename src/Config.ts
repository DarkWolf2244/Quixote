import * as fs from 'fs';

export function setProperty(property: string, value: any): void {
    let config = JSON.parse(fs.readFileSync(__dirname + '/configFile.json', 'utf8'));
    config[property] = value;
    fs.writeFileSync(__dirname + '/configFile.json', JSON.stringify(config, null, 4));
}

export function getProperty(property: string): any {
    let config = JSON.parse(fs.readFileSync(__dirname + '/configFile.json', 'utf8'));
    return config[property];
}
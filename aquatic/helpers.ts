import { Attribute } from "./component";

const mustacheRegex = /{{.*}}/g;

const aquaticConstants = [
    "class",
    "a-for"
];

const removeConstantsFromAttrs = (attrs: Attribute[]) => attrs.filter(l => aquaticConstants.indexOf(l.name) === -1);

const objToCSS = (obj: Record<string, any>) => {
    let str = "";
    for (const i in obj) {
        str += `${i}: ${obj[i]};`
    }
    return str;
};

const elementSupportsAttribute = (element: string, attribute: string): boolean => {
    const test = document.createElement(element);
    return (attribute in test || attribute === "class");
};

const filterMustache = (str: string) => str.substring(2, str.length - 2).trim();

const attributesToStr = (attributes: Record<string, string>) => {
    let str = "";
    for (const i in attributes) {
        if (i !== undefined) {
            str += `${i}="${attributes[i]}"`
        }
    }
    return str;
};

const collapseNodeStyles = (node: Element) => {
    const styleStrings = document.createElement("style");
    const removeArr = [];

    const childNodes = node.children;

    if (childNodes.length > 0) {
        for (const i in childNodes) {
            if (childNodes[i] && childNodes[i].nodeName !== undefined && childNodes[i].nodeName.toLowerCase() === "style") {
                styleStrings.innerHTML += childNodes[i].innerHTML;
                removeArr.push(childNodes[i]);
            }
        }
    }

    for (const thing of removeArr) {
        node.removeChild(thing);
    }

    return [node, styleStrings];
};

const isElement = (obj: Record<any, any>): obj is Element => {
    return obj instanceof Element;
};

const namedNodeMapToArr = (nodes: NamedNodeMap): Attribute[] => {
    if (nodes.length === 0) {
        return [];
    }
    const result: Attribute[] = [];
    let cur = 0;
    let curAttr;
    while ((curAttr = nodes.item(cur))) {
        result.push({name: curAttr.nodeName, value: curAttr.nodeValue});
        cur++;
    }
    return result;
};

const objToAttrs = (obj: Record<string, any>): Attribute[] => {
    const keys = Object.keys(obj);
    return Object.values(obj).map((l, idx) => ({name: keys[idx], value: l}));
};

const hasAFor = (node: Node, props: Attribute[]): node is Element => {
    return (isElement(node) ? node.hasAttribute("a-for") : false) || props.findIndex(l => l.name === "a-for") > -1
};

const methodToAttribute = (name: string, method: Function): Attribute => ({name, value: method.toString()});

export { mustacheRegex, removeConstantsFromAttrs, objToCSS, elementSupportsAttribute, filterMustache, collapseNodeStyles, isElement, namedNodeMapToArr, hasAFor, objToAttrs, methodToAttribute };

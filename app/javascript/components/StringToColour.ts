function hashFunction(str: string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash
}

function colourTransformOne(hash:number){
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}//Attribution: https://stackoverflow.com/a/16348977
//Note, the UI doesn't quite handle dark colors correctly.
//Swapped out and kept here for potential future modification

function colourTransformTwo(hash:number){
    var colours = 
        ["#F0A3FF", "#0075DC", "#B0623B", "#2BCE48", "#FFCC99", 
         "#AAAAAA", "#94FFB5", "#C20088", "#FFA405", "#FF0010", 
         "#5EF1F2", "#E0FF66", "#FF5005", "#FFFF00", "#84C757"]
    //From https://en.wikipedia.org/wiki/Help:Distinguishable_colors
    //Modified with custom colours and removal of dark colours
    var len = colours.length;
    return colours[((hash%len)+len)%len]; //Fancy modulo function to ensure negative numbers mod len is positive.
}

function StringToBackgroundColour(str: string) {
    return colourTransformTwo(hashFunction(str));
}


interface RGB {
    b: number;
    g: number;
    r: number;
}

function rgbToYIQ({ r, g, b }: RGB): number {
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

function hexToRgb(hex: string): RGB | undefined {
    if (!hex || hex === undefined || hex === '') {
        return undefined;
    }

    const result: RegExpExecArray | null =
          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : undefined;
}

function contrast(colorHex: string, threshold: number = 128): string {
    if (colorHex === undefined) {
        return '#000';
    }

    const rgb: RGB | undefined = hexToRgb(colorHex);

    if (rgb === undefined) {
        return '#000';
    }

    return rgbToYIQ(rgb) >= threshold ? '#000' : '#fff';
}

// Attribution: https://medium.com/better-programming/generate-contrasting-text-for-your-random-background-color-ac302dc87b4

export default function StringToColour(colorHex: string, isText:boolean) {
    var backgroundHex:string = StringToBackgroundColour(colorHex);
    return isText ? contrast(backgroundHex) : backgroundHex;
}
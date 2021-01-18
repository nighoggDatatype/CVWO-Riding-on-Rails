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
}
//Attribution: https://stackoverflow.com/a/16348977


function StringToBackgroundColour(str: string) {
    return colourTransformOne(hashFunction(str));
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
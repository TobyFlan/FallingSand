function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0'); // Convert to hex and pad with zeros
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}


export default function hueRandomizer() {

    let hue = 320; // Initial hue value
    let inc = 1;

    return function getNextColor() {
      hue = (hue + inc); // Increment hue and wrap around at 360
      if(hue >= 340 || hue <= 250) {
        inc = -inc;
      }
      return hslToHex(hue, 100, 50); // Convert HSL to hex and return
    };
  }
  

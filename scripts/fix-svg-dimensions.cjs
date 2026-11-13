const fs = require('fs');
const path = require('path');

const decorDir = path.join(__dirname, '..', 'public', 'images', 'menu-decor');
const files = fs.readdirSync(decorDir).filter(f => f.endsWith('.svg'));

files.forEach(f => {
  const p = path.join(decorDir, f);
  let content = fs.readFileSync(p, 'utf8');
  const svgTagMatch = content.match(/<svg([^>]*)>/);
  if (!svgTagMatch) return;
  const svgAttrs = svgTagMatch[1];
  const vbMatch = svgAttrs.match(/viewBox=["']([^"']+)["']/);
  if (!vbMatch) return;
  const parts = vbMatch[1].trim().split(/\s+/).map(Number);
  const w = parts[2];
  const h = parts[3];
  if (w && h) {
    const hasWidth = /\bwidth=/.test(svgAttrs);
    const hasHeight = /\bheight=/.test(svgAttrs);
    if (!hasWidth || !hasHeight) {
      const newAttrs = ` width="${w}" height="${h}"` + svgAttrs;
      content = content.replace(/<svg[^>]*>/, `<svg${newAttrs}>`);
      fs.writeFileSync(p, content, 'utf8');
      console.log(`Updated ${f} with width=${w} height=${h}`);
    }
  }
});

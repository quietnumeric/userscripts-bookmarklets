export default function() {
  const ms = 500;
  const loaded = document.createElement('span');
  loaded.textContent = 'loaded.';
  loaded.style.fontSize = '0.8em';
  loaded.style.position = 'absolute';
  loaded.style.textAlign = 'left';
  loaded.style.top = '0';
  loaded.style.right = '0';
  loaded.style.width = '99%';
  loaded.style.transition = `width ${ms}ms ease-out`;
  const layer = document.createElement('span');
  layer.appendChild(loaded);
  layer.style.position = 'fixed';
  layer.style.top = '0';
  layer.style.left = '0';
  layer.style.width = '100%';
  layer.style.height = '100%';
  layer.style.backgroundColor = 'rgba(83, 53, 201, 0.2)';
  layer.style.opacity = '1';
  layer.style.transition = `opacity ${ms}ms ease-out, height ${ms}ms ease-out`;
  layer.style.zIndex = 2147483647;
  document.body.appendChild(layer);
  setTimeout(() => {
    loaded.style.width = '0';
    layer.style.opacity = '0';
    layer.style.height = '0';
    setTimeout(() => {
      document.body.removeChild(layer);
    }, ms);
  }, 0);
  console.log('loaded.');
}

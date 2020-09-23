export const hideLoader = () => {
  const target = document.getElementById('wx-loading');
  target.style.opacity = '0';
  target.addEventListener('transitionend', () => target.remove());
};

jarallax(document.querySelectorAll('.jarallax'), {
  speed: 0.2,
});

const position = document.documentElement;
const background = document.querySelector('.bkg-con');
const bodyLayer = document.querySelector('.body-layer');
const clipPathCon = document.querySelector('.clip-path-con');
const slide8 = document.querySelector('.slide-8');
const box8 = document.querySelector('.box8');
const slide9 = document.querySelector('.slide-9');
const videoTitle = document.querySelector('.video-con h1');

let opacityOffset = 1;

addEventListener('scroll', (e) => {
  clipPathCon.style.opacity = opacityOffset;
  videoTitle.style.opacity = opacityOffset;

  const clipPathConBottom = clipPathCon.getBoundingClientRect().bottom;

  const box8Top = box8.getBoundingClientRect().top;

  if (box8Top <= clipPathConBottom) {
    if (opacityOffset >= 0) {
      opacityOffset -= 0.05;

      if (opacityOffset < 0.05) opacityOffset = 0;
    }
  } else {
    if (opacityOffset <= 1) {
      opacityOffset += 0.05;
      if (opacityOffset > 1) opacityOffset = 1;
    }
  }

  position.style.setProperty('--y', scrollY + 'px');

  if (scrollY >= 639) {
    background.style.cssText = 'opacity:0';
  } else {
    background.style.cssText = 'opacity:1';
  }

  if (scrollY >= 895 && scrollY <= 2563) {
    bodyLayer.style.height = scrollY / 5 + 'px';
  }
});

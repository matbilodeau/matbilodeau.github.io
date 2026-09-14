// Dean Attali / Beautiful Jekyll 2016

var main = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    var navbar = document.querySelector('.navbar');
    var mainNavbar = document.getElementById('main-navbar');

    // Shorten the navbar after scrolling a little bit down
    if (navbar) {
      window.addEventListener('scroll', function() {
        navbar.classList.toggle('top-nav-short', window.scrollY > 50);
      });
    }

    // On mobile, hide the avatar when expanding the navbar menu
    if (navbar && mainNavbar) {
      mainNavbar.addEventListener('show.bs.collapse', function () {
        navbar.classList.add('top-nav-expanded');
      });
      mainNavbar.addEventListener('hidden.bs.collapse', function () {
        navbar.classList.remove('top-nav-expanded');
      });
    }

    // show the big header image
    main.initImgs();

    // Initialize Bootstrap 5 tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Theme toggle
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      var themeStates = ['auto', 'light', 'dark'];
      var themeIcons = {
        auto: document.getElementById('theme-icon-auto'),
        light: document.getElementById('theme-icon-light'),
        dark: document.getElementById('theme-icon-dark')
      };

      function updateThemeTooltip(state) {
        var tooltipText = themeToggle.getAttribute('data-tooltip-' + state) || '';
        themeToggle.setAttribute('title', tooltipText);
        themeToggle.setAttribute('data-bs-original-title', tooltipText);
        var bsTooltip = bootstrap.Tooltip.getInstance(themeToggle);
        if (bsTooltip) {
          bsTooltip.dispose();
          new bootstrap.Tooltip(themeToggle);
          if (themeToggle.matches(':hover')) {
            bootstrap.Tooltip.getOrCreateInstance(themeToggle).show();
          }
        }
      }

      function updateThemeUI(state) {
        for (var key in themeIcons) {
          if (themeIcons[key]) {
            themeIcons[key].style.display = (key === state) ? '' : 'none';
          }
        }
        if (state === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (state === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
        }
        var hljsDark = document.getElementById('hljs-dark');
        if (hljsDark) {
          var isDark = (state === 'dark') || (state === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          hljsDark.media = isDark ? 'all' : 'not all';
        }
        updateThemeTooltip(state);
      }

      // Initialize from localStorage
      var savedTheme = localStorage.getItem('theme');
      if (themeStates.indexOf(savedTheme) !== -1) {
        updateThemeUI(savedTheme);
      } else {
        updateThemeUI('auto');
      }

      themeToggle.addEventListener('click', function() {
        var current = localStorage.getItem('theme') || 'auto';
        var next = themeStates[(themeStates.indexOf(current) + 1) % themeStates.length];
        updateThemeUI(next);
        localStorage.setItem('theme', next);
      });
    }
  },

  initImgs : function() {
    // If the page has large images to randomly select from, choose an image
    main.bigImgEl = document.getElementById('header-big-imgs');
    if (!main.bigImgEl) return;
    main.numImgs = parseInt(main.bigImgEl.getAttribute('data-num-img'), 10) || 0;

    // set an initial image
    var imgInfo = main.getImgInfo();
    main.setImg(imgInfo.src, imgInfo.desc, imgInfo.position);

    // If the user prefers reduced motion, skip the cycling animation
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var header = document.querySelector('.intro-header.big-img');

    // For better UX, prefetch the next image so that it will already be loaded when we want to show it
    var getNextImg = function() {
      var next = main.getImgInfo();

      var prefetchImg = new Image();
      prefetchImg.src = next.src;

      setTimeout(function() {
        var img = document.createElement('div');
        img.className = 'big-img-transition';
        img.style.backgroundImage = 'url(' + next.src + ')';
        if (next.position !== null) {
          img.style.backgroundPosition = next.position;
        }
        header.prepend(img);
        setTimeout(function() { img.style.opacity = '1'; }, 50);

        // after the animation of fading in the new image is done, prefetch the next one
        setTimeout(function() {
          main.setImg(next.src, next.desc, next.position);
          img.remove();
          getNextImg();
        }, 1000);
      }, 6000);
    };

    // If there are multiple images, cycle through them
    if (main.numImgs > 1) {
      getNextImg();
    }
  },

  getImgInfo : function() {
    var randNum = Math.floor((Math.random() * main.numImgs) + 1);
    return {
      src : main.bigImgEl.getAttribute('data-img-src-' + randNum),
      desc : main.bigImgEl.getAttribute('data-img-desc-' + randNum),
      position : main.bigImgEl.getAttribute('data-img-position-' + randNum)
    };
  },

  setImg : function(src, desc, position) {
    var header = document.querySelector('.intro-header.big-img');
    header.style.backgroundImage = 'url(' + src + ')';
    // Reset background-position if the previous image set one.
    header.style.backgroundPosition = position !== null ? position : '';

    var imageDesc = document.querySelector('.img-desc');
    if (desc === null) {
      imageDesc.style.display = 'none';
      return;
    }
    imageDesc.textContent = '';
    // Markdown links in the description become anchors: [text](url)
    var mdLinkRe = /\[(.*?)\]\((.+?)\)/;
    var splitDesc = desc.split(mdLinkRe);
    // After split, every 3rd element is text, then link text, then link url
    splitDesc.forEach(function (element, index) {
      if (index % 3 === 0) {
        imageDesc.append(element);
      } else if (index % 3 === 2) {
        var link = document.createElement('a');
        link.href = element;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = splitDesc[index - 1];
        imageDesc.append(link);
      }
    });
    imageDesc.style.display = '';
  }
};

document.addEventListener('DOMContentLoaded', main.init);
/**
 * Add copy button to code block
 */
document.addEventListener('DOMContentLoaded', () => {
  const highlights = document.querySelectorAll('.row div.highlight');
  highlights.forEach((highlight) => {
      const copyButton = document.createElement('button');
      copyButton.classList.add('copyCodeButton', 'btn', 'btn-sm', 'btn-outline-secondary');
      copyButton.setAttribute('title', 'Copy to clipboard');
      copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
      highlight.appendChild(copyButton);

      const codeBlock = highlight.querySelector('code[data-lang]');
      if (!codeBlock) return;

      copyButton.addEventListener('click', () => {
          const codeBlockClone = codeBlock.cloneNode(true);

          const lineNumbers = codeBlockClone.querySelectorAll('.ln');
          lineNumbers.forEach(ln => ln.remove());

          const codeText = codeBlockClone.textContent.replace(/\n$/, '');

          navigator.clipboard.writeText(codeText)
              .then(() => {
                  copyButton.innerHTML = '<i class="fa-solid fa-check"></i>';
                  copyButton.classList.remove('btn-outline-secondary');
                  copyButton.classList.add('btn-success');

                  setTimeout(() => {
                      copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
                      copyButton.classList.remove('btn-success');
                      copyButton.classList.add('btn-outline-secondary');
                  }, 1000);
              })
              .catch((err) => {
                  alert('Failed to copy text');
                  console.error('Something went wrong', err);
              });
      });
  });
});

;
(function () {
  var panel = document.getElementById('toc-panel');
  if (!panel) return;

  var mode = panel.getAttribute('data-toc-mode') || 'headings';

  function removePanel() {
    panel.remove();
    var navToggle = document.getElementById('toc-toggle');
    if (navToggle) navToggle.remove();
  }

  if (mode === 'posts') {
    if (!panel.querySelector('.toc-post-list li')) {
      removePanel();
      return;
    }
  } else {
    if (panel.querySelectorAll('#TableOfContents a').length <= 1) {
      removePanel();
      return;
    }
  }

  var toggle = document.getElementById('toc-toggle');
  var offcanvas = bootstrap.Offcanvas.getOrCreateInstance(panel);
  var returnFocus = true;

  if (toggle) {
    toggle.addEventListener('click', function () {
      offcanvas.toggle();
    });
  }

  panel.addEventListener('show.bs.offcanvas', function () {
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  });
  panel.addEventListener('hide.bs.offcanvas', function () {
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    returnFocus = panel.contains(document.activeElement);
  });
  panel.addEventListener('hidden.bs.offcanvas', function () {
    if (!returnFocus || !toggle) return;
    // Focus would otherwise show the toggle's tooltip until the next blur.
    // Tooltip.show() is queued, so hide() after focus() is too early; disable
    // the tooltip across the focus call instead.
    var tip = bootstrap.Tooltip.getInstance(toggle);
    if (tip) tip.disable();
    toggle.focus();
    if (tip) setTimeout(function () { tip.enable(); }, 0);
  });

  // Following a link should leave focus on the destination, not the toggle.
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a[href]')) {
      offcanvas.hide();
      returnFocus = false;
    }
  });

  if (mode === 'posts') {
    var postLinks = panel.querySelectorAll('.toc-post-list a');

    var postPreviews = document.querySelectorAll('.post-preview');
    if (postPreviews.length === 0) return;

    var activePostLink = null;

    // The panel lists every post, but the page shows one pager of previews,
    // so match previews to links by URL rather than by index.
    var linkByHref = {};
    postLinks.forEach(function (link) {
      linkByHref[link.pathname] = link;
    });

    function setActivePost(preview) {
      if (activePostLink) activePostLink.classList.remove('toc-active');
      var anchor = preview.querySelector('a[href]');
      var link = anchor ? linkByHref[anchor.pathname] : null;
      if (link) {
        link.classList.add('toc-active');
        activePostLink = link;
        link.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
    }

    var postObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActivePost(entry.target);
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    postPreviews.forEach(function (el) {
      postObserver.observe(el);
    });
  } else {
    var headings = [];
    document.querySelectorAll('.blog-post h2, .blog-post h3, .blog-post h4, .blog-post h5, .blog-post h6').forEach(function (h) {
      if (h.id) headings.push(h);
    });

    if (headings.length === 0) return;

    var activeLink = null;

    function setActive(id) {
      if (activeLink) activeLink.classList.remove('toc-active');
      var link = panel.querySelector('a[href="#' + CSS.escape(id) + '"]');
      if (link) {
        link.classList.add('toc-active');
        activeLink = link;
        link.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    headings.forEach(function (h) {
      observer.observe(h);
    });
  }
})();

;
/*
  Put this file in /assets/js/load-photoswipe.js
  Documentation and licence at https://github.com/liwenyip/hugo-easy-gallery/
*/

/* PhotoSwipe 5 integration for Beautiful Hugo */
document.addEventListener('DOMContentLoaded', function () {
    var items = [];
    var figureEls = [];

    function isLightboxFigure(figure) {
        return !figure.classList.contains('no-photoswipe') && figure.querySelector('a');
    }

    // Scan all <figure> elements and build the slide data array.
    document.querySelectorAll('figure').forEach(function (figure) {
        if (!isLightboxFigure(figure)) return;

        var a = figure.querySelector('a');
        var sizeAttr = a.dataset.size;
        var width = parseInt(a.dataset.pswpWidth, 10) || (sizeAttr ? parseInt(sizeAttr.split('x')[0], 10) : 0);
        var height = parseInt(a.dataset.pswpHeight, 10) || (sizeAttr ? parseInt(sizeAttr.split('x')[1], 10) : 0);

        var figcaption = figure.querySelector('figcaption');
        var img = figure.querySelector('img');

        items.push({
            src: a.getAttribute('href'),
            width: width,
            height: height,
            alt: (img && img.getAttribute('alt')) || '',
            caption: figcaption ? figcaption.innerHTML : ''
        });
        figureEls.push(figure);
    });

    if (!items.length) return;

    // Resolve all missing dimensions, pre-caching images in the process.
    Promise.all(items.map(function (item) {
        if (item.width > 0 && item.height > 0) {
            return Promise.resolve(item);
        }
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () {
                item.width = img.naturalWidth;
                item.height = img.naturalHeight;
                resolve(item);
            };
            img.onerror = function () {
                item.width = 800;
                item.height = 600;
                resolve(item);
            };
            // Start loading without blocking UI
            img.src = item.src;
        });
    })).then(function () {
        // Lightbox options kept minimal – rely on PhotoSwipe 5 defaults
        var lightbox = new PhotoSwipeLightbox({
            dataSource: items,
            pswpModule: PhotoSwipe,
            bgOpacity: 1,
            showHideAnimationType: 'fade',
            padding: { top: 40, bottom: 40, left: 40, right: 40 }
        });

        lightbox.on('uiRegister', function () {
            lightbox.pswp.ui.registerElement({
                name: 'default-caption',
                order: 9,
                isButton: false,
                appendTo: 'root',
                onInit: function (el) {
                    el.style.position = 'absolute';
                    el.style.bottom = '15px';
                    el.style.left = '0';
                    el.style.right = '0';
                    el.style.padding = '0 20px';
                    el.style.color = 'rgba(255, 255, 255, 0.7)';
                    el.style.fontSize = '14px';
                    el.style.textAlign = 'center';
                    el.style.pointerEvents = 'none';

                    lightbox.pswp.on('change', function () {
                        var slide = lightbox.pswp.currSlide;
                        if (slide && slide.data && slide.data.caption) {
                            el.innerHTML = slide.data.caption;
                            var attrLink = el.querySelector('a');
                            if (attrLink) {
                                attrLink.style.pointerEvents = 'auto';
                                attrLink.style.color = 'rgba(255, 255, 255, 0.8)';
                            }
                            var attr = el.querySelector('p.attr');
                            if (attr) {
                                attr.style.fontSize = '0.9em';
                                attr.style.opacity = '0.8';
                            }
                        } else {
                            el.innerHTML = '';
                        }
                    });
                }
            });
        });

        lightbox.init();

        // Wire up click handlers.
        figureEls.forEach(function (figure, idx) {
            figure.addEventListener('click', function (event) {
                if (event.target.closest('figcaption a')) return;
                event.preventDefault();
                lightbox.loadAndOpen(idx);
            });
        });
    });
});

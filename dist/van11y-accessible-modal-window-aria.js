/*
 * ES2015 accessible modal window system, using ARIA
 * Website: https://van11y.net/accessible-modal/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-modal-window-aria/blob/master/LICENSE
 */
'use strict';

(function (doc) {

  'use strict';

  var MODAL_JS_CLASS = 'js-modal';
  var MODAL_ID_PREFIX = 'label_modal_';
  var MODAL_CLASS_SUFFIX = 'modal';
  var MODAL_DATA_BACKGROUND_ATTR = 'data-modal-background-click';
  var MODAL_PREFIX_CLASS_ATTR = 'data-modal-prefix-class';
  var MODAL_TEXT_ATTR = 'data-modal-text';
  var MODAL_CONTENT_ID_ATTR = 'data-modal-content-id';
  var MODAL_DESCRIBEDBY_ID_ATTR = 'data-modal-describedby-id';
  var MODAL_TITLE_ATTR = 'data-modal-title';
  var MODAL_FOCUS_TO_ATTR = 'data-modal-focus-toid';
  var MODAL_CLOSE_TEXT_ATTR = 'data-modal-close-text';
  var MODAL_CLOSE_TITLE_ATTR = 'data-modal-close-title';
  var MODAL_CLOSE_IMG_ATTR = 'data-modal-close-img';
  var MODAL_ROLE = 'dialog';

  var MODAL_BUTTON_CLASS_SUFFIX = 'modal-close';
  var MODAL_BUTTON_JS_ID = 'js-modal-close';
  var MODAL_BUTTON_JS_CLASS = 'js-modal-close';
  var MODAL_BUTTON_CONTENT_BACK_ID = 'data-content-back-id';
  var MODAL_BUTTON_FOCUS_BACK_ID = 'data-focus-back';

  var MODAL_WRAPPER_CLASS_SUFFIX = 'modal__wrapper';
  var MODAL_CONTENT_CLASS_SUFFIX = 'modal__content';
  var MODAL_CONTENT_JS_ID = 'js-modal-content';

  var MODAL_CLOSE_IMG_CLASS_SUFFIX = 'modal__closeimg';
  var MODAL_CLOSE_TEXT_CLASS_SUFFIX = 'modal-close__text';

  var MODAL_TITLE_ID = 'modal-title';
  var MODAL_TITLE_CLASS_SUFFIX = 'modal-title';

  var FOCUSABLE_ELEMENTS_STRING = "a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
  var WRAPPER_PAGE_JS = 'js-modal-page';

  var MODAL_JS_ID = 'js-modal';

  var MODAL_OVERLAY_ID = 'js-modal-overlay';
  var MODAL_OVERLAY_CLASS_SUFFIX = 'modal-overlay';
  var MODAL_OVERLAY_TXT = 'Close modal';
  var MODAL_OVERLAY_BG_ENABLED_ATTR = 'data-background-click';

  var VISUALLY_HIDDEN_CLASS = 'invisible';
  var NO_SCROLL_CLASS = 'no-scroll';

  var ATTR_ROLE = 'role';
  var ATTR_OPEN = 'open';
  var ATTR_LABELLEDBY = 'aria-labelledby';
  var ATTR_DESCRIBEDBY = 'aria-describedby';
  var ATTR_HIDDEN = 'aria-hidden';
  //const ATTR_MODAL = 'aria-modal="true"';
  var ATTR_HASPOPUP = 'aria-haspopup';
  var ATTR_HASPOPUP_VALUE = 'dialog';

  var findById = function findById(id) {
    return doc.getElementById(id);
  };

  var addClass = function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className); // IE 10+
    } else {
        el.className += ' ' + className; // IE 8+
      }
  };

  var removeClass = function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className); // IE 10+
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
      }
  };

  var hasClass = function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className); // IE 10+
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
      }
  };
  /*const wrapInner = (el, wrapper_el) => { // doesn't work on IE/Edge, f…
      while (el.firstChild)
          wrapper_el.append(el.firstChild);
      el.append(wrapper_el);
   }*/
  function wrapInner(parent, wrapper) {
    if (typeof wrapper === "string") wrapper = document.createElement(wrapper);

    parent.appendChild(wrapper);

    while (parent.firstChild !== wrapper) wrapper.appendChild(parent.firstChild);
  }

  function remove(el) {
    /* node.remove() is too modern for IE≤11 */
    el.parentNode.removeChild(el);
  }

  /* gets an element el, search if it is child of parent class, returns id of the parent */
  var searchParent = function searchParent(el, parentClass) {
    var found = false;
    var parentElement = el.parentNode;
    while (parentElement && found === false) {
      if (hasClass(parentElement, parentClass) === true) {
        found = true;
      } else {
        parentElement = parentElement.parentNode;
      }
    }
    if (found === true) {
      return parentElement.getAttribute('id');
    } else {
      return '';
    }
  };

  /**
   * Create the template for an overlay
   * @param  {Object} config
   * @return {String}
   */
  var createOverlay = function createOverlay(config) {

    var id = MODAL_OVERLAY_ID;
    var overlayText = config.text || MODAL_OVERLAY_TXT;
    var overlayClass = config.prefixClass + MODAL_OVERLAY_CLASS_SUFFIX;
    var overlayBackgroundEnabled = config.backgroundEnabled === 'disabled' ? 'disabled' : 'enabled';

    return '<span\n                    id="' + id + '"\n                    class="' + overlayClass + '"\n                    ' + MODAL_OVERLAY_BG_ENABLED_ATTR + '="' + overlayBackgroundEnabled + '"\n                    title="' + overlayText + '"\n                    >\n                    <span class="' + VISUALLY_HIDDEN_CLASS + '">' + overlayText + '</span>\n                  </span>';
  };

  /**
   * Create the template for a modal
   * @param  {Object} config
   * @return {String}
   */
  var createModal = function createModal(config) {

    var id = MODAL_JS_ID;
    var modalClassName = config.modalPrefixClass + MODAL_CLASS_SUFFIX;
    var modalClassWrapper = config.modalPrefixClass + MODAL_WRAPPER_CLASS_SUFFIX;
    var buttonCloseClassName = config.modalPrefixClass + MODAL_BUTTON_CLASS_SUFFIX;
    var buttonCloseInner = config.modalCloseImgPath ? '<img src="' + config.modalCloseImgPath + '" alt="' + config.modalCloseText + '" class="' + config.modalPrefixClass + MODAL_CLOSE_IMG_CLASS_SUFFIX + '" />' : '<span class="' + config.modalPrefixClass + MODAL_CLOSE_TEXT_CLASS_SUFFIX + '">\n                                          ' + config.modalCloseText + '\n                                         </span>';
    var contentClassName = config.modalPrefixClass + MODAL_CONTENT_CLASS_SUFFIX;
    var titleClassName = config.modalPrefixClass + MODAL_TITLE_CLASS_SUFFIX;
    var title = config.modalTitle !== '' ? '<h1 id="' + MODAL_TITLE_ID + '" class="' + titleClassName + '">\n                                          ' + config.modalTitle + '\n                                         </h1>' : '';
    var button_close = '<button type="button" class="' + MODAL_BUTTON_JS_CLASS + ' ' + buttonCloseClassName + '" id="' + MODAL_BUTTON_JS_ID + '" title="' + config.modalCloseTitle + '" ' + MODAL_BUTTON_CONTENT_BACK_ID + '="' + config.modalContentId + '" ' + MODAL_BUTTON_FOCUS_BACK_ID + '="' + config.modalFocusBackId + '">\n                               ' + buttonCloseInner + '\n                              </button>';
    var content = config.modalText;
    var describedById = config.modalDescribedById !== '' ? ATTR_DESCRIBEDBY + '="' + config.modalDescribedById + '"' : '';

    // If there is no content but an id we try to fetch content id
    if (content === '' && config.modalContentId) {
      var contentFromId = findById(config.modalContentId);
      if (contentFromId) {
        content = '<div id="' + MODAL_CONTENT_JS_ID + '">\n                              ' + contentFromId.innerHTML + '\n                             </div';
        // we remove content from its source to avoid id duplicates, etc.
        contentFromId.innerHTML = '';
      }
    }

    return '<dialog id="' + id + '" class="' + modalClassName + '" ' + ATTR_ROLE + '="' + MODAL_ROLE + '" ' + describedById + ' ' + ATTR_OPEN + ' ' + ATTR_LABELLEDBY + '="' + MODAL_TITLE_ID + '">\n                    <div role="document" class="' + modalClassWrapper + '">\n                      ' + button_close + '\n                      <div class="' + contentClassName + '">\n                        ' + title + '\n                        ' + content + '\n                      </div>\n                    </div>\n                  </dialog>';
  };

  var closeModal = function closeModal(config) {

    remove(config.modal);
    remove(config.overlay);

    if (config.contentBackId !== '') {
      var contentBack = findById(config.contentBackId);
      if (contentBack) {
        contentBack.innerHTML = config.modalContent;
      }
    }

    if (config.modalFocusBackId) {
      var contentFocus = findById(config.modalFocusBackId);
      if (contentFocus) {
        contentFocus.focus();
      }
    }
  };

  /** Find all modals inside a container
   * @param  {Node} node Default document
   * @return {Array}
   */
  var $listModals = function $listModals() {
    var node = arguments.length <= 0 || arguments[0] === undefined ? doc : arguments[0];
    return [].slice.call(node.querySelectorAll('.' + MODAL_JS_CLASS));
  };

  /**
   * Build modals for a container
   * @param  {Node} node
   */
  var attach = function attach(node) {
    var addListeners = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    $listModals(node).forEach(function (modal_node) {

      var iLisible = Math.random().toString(32).slice(2, 12);
      var wrapperBody = findById(WRAPPER_PAGE_JS);
      var body = doc.querySelector('body');

      modal_node.setAttribute('id', MODAL_ID_PREFIX + iLisible);
      modal_node.setAttribute(ATTR_HASPOPUP, ATTR_HASPOPUP_VALUE);

      if (wrapperBody === null || wrapperBody.length === 0) {
        var wrapper = doc.createElement('DIV');
        wrapper.setAttribute('id', WRAPPER_PAGE_JS);
        wrapInner(body, wrapper);
      }
    });

    if (addListeners) {

      /* listeners */
      ['click', 'keydown'].forEach(function (eventName) {

        doc.body.addEventListener(eventName, function (e) {

          // click on link modal
          var parentModalLauncher = searchParent(e.target, MODAL_JS_CLASS);
          if ((hasClass(e.target, MODAL_JS_CLASS) === true || parentModalLauncher !== '') && eventName === 'click') {
            var body = doc.querySelector('body');
            var modalLauncher = parentModalLauncher !== '' ? findById(parentModalLauncher) : e.target;
            var modalPrefixClass = modalLauncher.hasAttribute(MODAL_PREFIX_CLASS_ATTR) === true ? modalLauncher.getAttribute(MODAL_PREFIX_CLASS_ATTR) + '-' : '';
            var modalText = modalLauncher.hasAttribute(MODAL_TEXT_ATTR) === true ? modalLauncher.getAttribute(MODAL_TEXT_ATTR) : '';
            var modalContentId = modalLauncher.hasAttribute(MODAL_CONTENT_ID_ATTR) === true ? modalLauncher.getAttribute(MODAL_CONTENT_ID_ATTR) : '';
            var modalDescribedById = modalLauncher.hasAttribute(MODAL_DESCRIBEDBY_ID_ATTR) === true ? modalLauncher.getAttribute(MODAL_DESCRIBEDBY_ID_ATTR) : '';
            var modalTitle = modalLauncher.hasAttribute(MODAL_TITLE_ATTR) === true ? modalLauncher.getAttribute(MODAL_TITLE_ATTR) : '';
            var modalCloseText = modalLauncher.hasAttribute(MODAL_CLOSE_TEXT_ATTR) === true ? modalLauncher.getAttribute(MODAL_CLOSE_TEXT_ATTR) : MODAL_OVERLAY_TXT;
            var modalCloseTitle = modalLauncher.hasAttribute(MODAL_CLOSE_TITLE_ATTR) === true ? modalLauncher.getAttribute(MODAL_CLOSE_TITLE_ATTR) : modalCloseText;
            var modalCloseImgPath = modalLauncher.hasAttribute(MODAL_CLOSE_IMG_ATTR) === true ? modalLauncher.getAttribute(MODAL_CLOSE_IMG_ATTR) : '';
            var backgroundEnabled = modalLauncher.hasAttribute(MODAL_DATA_BACKGROUND_ATTR) === true ? modalLauncher.getAttribute(MODAL_DATA_BACKGROUND_ATTR) : '';
            var modalGiveFocusToId = modalLauncher.hasAttribute(MODAL_FOCUS_TO_ATTR) === true ? modalLauncher.getAttribute(MODAL_FOCUS_TO_ATTR) : '';

            var wrapperBody = findById(WRAPPER_PAGE_JS);

            // insert overlay
            body.insertAdjacentHTML('beforeEnd', createOverlay({
              text: modalCloseTitle,
              backgroundEnabled: backgroundEnabled,
              prefixClass: modalPrefixClass
            }));

            // insert modal
            body.insertAdjacentHTML('beforeEnd', createModal({
              modalText: modalText,
              modalPrefixClass: modalPrefixClass,
              backgroundEnabled: modalContentId,
              modalTitle: modalTitle,
              modalCloseText: modalCloseText,
              modalCloseTitle: modalCloseTitle,
              modalCloseImgPath: modalCloseImgPath,
              modalContentId: modalContentId,
              modalDescribedById: modalDescribedById,
              modalFocusBackId: modalLauncher.getAttribute('id')
            }));

            // hide page
            wrapperBody.setAttribute(ATTR_HIDDEN, 'true');

            // add class noscroll to body
            addClass(body, NO_SCROLL_CLASS);

            // give focus to close button or specified element
            var closeButton = findById(MODAL_BUTTON_JS_ID);
            if (modalGiveFocusToId !== '') {
              var focusTo = findById(modalGiveFocusToId);
              if (focusTo) {
                focusTo.focus();
              } else {
                closeButton.focus();
              }
            } else {
              closeButton.focus();
            }

            e.preventDefault();
          }

          // click on close button or on overlay not blocked
          var parentButton = searchParent(e.target, MODAL_BUTTON_JS_CLASS);
          if ((e.target.getAttribute('id') === MODAL_BUTTON_JS_ID || parentButton !== '' || e.target.getAttribute('id') === MODAL_OVERLAY_ID || hasClass(e.target, MODAL_BUTTON_JS_CLASS) === true) && eventName === 'click') {
            var body = doc.querySelector('body');
            var wrapperBody = findById(WRAPPER_PAGE_JS);
            var modal = findById(MODAL_JS_ID);
            var modalContent = findById(MODAL_CONTENT_JS_ID) ? findById(MODAL_CONTENT_JS_ID).innerHTML : '';
            var overlay = findById(MODAL_OVERLAY_ID);
            var modalButtonClose = findById(MODAL_BUTTON_JS_ID);
            var modalFocusBackId = modalButtonClose.getAttribute(MODAL_BUTTON_FOCUS_BACK_ID);
            var contentBackId = modalButtonClose.getAttribute(MODAL_BUTTON_CONTENT_BACK_ID);
            var backgroundEnabled = overlay.getAttribute(MODAL_OVERLAY_BG_ENABLED_ATTR);

            if (!(e.target.getAttribute('id') === MODAL_OVERLAY_ID && backgroundEnabled === 'disabled')) {

              closeModal({
                modal: modal,
                modalContent: modalContent,
                overlay: overlay,
                modalFocusBackId: modalFocusBackId,
                contentBackId: contentBackId,
                backgroundEnabled: backgroundEnabled,
                fromId: e.target.getAttribute('id')
              });

              // show back page
              wrapperBody.removeAttribute(ATTR_HIDDEN);

              // remove class noscroll to body
              removeClass(body, NO_SCROLL_CLASS);
            }
          }

          // strike a key when modal opened
          if (findById(MODAL_JS_ID) && eventName === 'keydown') {
            var body = doc.querySelector('body');
            var wrapperBody = findById(WRAPPER_PAGE_JS);
            var modal = findById(MODAL_JS_ID);
            var modalContent = findById(MODAL_CONTENT_JS_ID) ? findById(MODAL_CONTENT_JS_ID).innerHTML : '';
            var overlay = findById(MODAL_OVERLAY_ID);
            var modalButtonClose = findById(MODAL_BUTTON_JS_ID);
            var modalFocusBackId = modalButtonClose.getAttribute(MODAL_BUTTON_FOCUS_BACK_ID);
            var contentBackId = modalButtonClose.getAttribute(MODAL_BUTTON_CONTENT_BACK_ID);
            var $listFocusables = [].slice.call(modal.querySelectorAll(FOCUSABLE_ELEMENTS_STRING));

            // esc
            if (e.keyCode === 27) {

              closeModal({
                modal: modal,
                modalContent: modalContent,
                overlay: overlay,
                modalFocusBackId: modalFocusBackId,
                contentBackId: contentBackId
              });

              // show back page
              wrapperBody.removeAttribute(ATTR_HIDDEN);

              // remove class noscroll to body
              removeClass(body, NO_SCROLL_CLASS);
            }

            // tab or Maj Tab in modal => capture focus
            if (e.keyCode === 9 && $listFocusables.indexOf(e.target) >= 0) {

              // maj-tab on first element focusable => focus on last
              if (e.shiftKey) {
                if (e.target === $listFocusables[0]) {
                  $listFocusables[$listFocusables.length - 1].focus();
                  e.preventDefault();
                }
              } else {
                // tab on last element focusable => focus on first
                if (e.target === $listFocusables[$listFocusables.length - 1]) {
                  $listFocusables[0].focus();
                  e.preventDefault();
                }
              }
            }

            // tab outside modal => put it in focus
            if (e.keyCode === 9 && $listFocusables.indexOf(e.target) === -1) {
              e.preventDefault();
              $listFocusables[0].focus();
            }
          }
        }, true);
      });
    }
  };

  var onLoad = function onLoad() {
    attach();
    document.removeEventListener('DOMContentLoaded', onLoad);
  };

  document.addEventListener('DOMContentLoaded', onLoad);

  window.van11yAccessibleModalWindowAria = attach;
})(document);

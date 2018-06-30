# Van11y accessible  modal window system, using ARIA

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

This script will provide you an accessible modal window using ARIA.

The demo is here: https://van11y.net/downloads/modal/demo/index.html

Website is here: https://van11y.net/accessible-modal/

La page existe aussi en français : https://van11y.net/fr/modale-accessible/

## How it works

Basically, when you activate one:

- the script wraps all the page into a <code>div id="js-modal-page"</code>;
- adds the <code>noscroll</code> class on the <code>body</code> element (to remove scroll with CSS if needed);
- then inserts a <code>dialog</code> element at the end of your page;
- puts the focus into it and __traps focus in the modal window__;
- When you exit it, the focus is given back to the element that opened it.

You can close it using <kbd>Esc</kbd>, or by using <kbd>Enter</kbd> or <kbd>Space</kbd> if you’re on the close button.

Mouse users can click outside the modal window to close it (this option can be disabled if needed).

If you never activate a modal window, it won’t be anywhere in the code.


## How to use it


__Download the script__

You may use npm command: <code>npm i van11y-accessible-modal-window-aria</code>.
You may also use bower: <code>bower install van11y-accessible-modal-window-aria</code>.

__Option and attributes__

First, put <code>class="js-modal"</code> on a button or a link to activate the script. Then, here are all attributes:

- Attribute <code>data-modal-prefix-class</code>: will namespace all the modal CSS element classnames.
- Attribute <code>data-modal-text</code>: the text of your modal window (will be put into a <code>p</code> tag).
- Attribute <code>data-modal-content-id</code>: the <code>id</code> of (hidden) content in your page that will be put into your modal window (if <code>data-modal-text</code> is not present).
- Attribute <code>data-modal-title</code>: the main title of the modal window.
- Attribute <code>data-modal-close-text</code>: the text of the close button in your modal window.
- Attribute <code>data-modal-close-title</code>: the title attribute of the close button in your modal window.
- Attribute <code>data-modal-background-click="disabled"</code>: disable the possibility to click outside the modal window to close it.
- Attribute <code>data-modal-close-img</code>: a path to a valid image for the close button.
- Attribute <code>data-modal-focus-toid</code>: the <code>id</code> of the element in the modal you want to give the focus to, when loading the modal (closing button if not specified).
- Attribute <code>data-modal-describedby-id</code>: adds `aria-describedby=<the value of this attribute>` to the `dialog` tag.

If you need to close it, add `class="js-modal-close"` on an element in the modal content, it will trigger a click on close button.

Remember there are some demos, it will be easier to understand: <a href="https://van11y.net/downloads/modal/demo/index.html">Demo of accessible modal window</a>

The script is launched when the page is loaded. If you need to execute it on AJAX-inserted content, you may use for example on `<div id="newContent">your modal launcher source</div>`:

```van11yAccessibleModalWindowAria(document.getElementById('newContent')[, addListeners]);```

<code>addListeners</code> is a facultative boolean (by default set to <code>true</code>) to add modal listeners (should be set up only the first time in most of the cases).

## Minimal styling classes

Here is the minimal set of styles needed to make it work (without data-modal-prefix-class attribute):

```css
/* needed for old browsers */
dialog {
  display: block;
  border: 0;
}
/* removes scroll when modal is opened */
.no-scroll {
  overflow: hidden;
}
/* overlay covers everything */
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 666;
}
/* modal */
.modal {
  position: fixed;
  left: 25%;
  right: auto;
  top: 15%;
  width: 50%;
  background: #fff;
  z-index: 667;
}
```


## Styling classes example

Here are the styles (unprefixed) used for the demo, I’ve used <code>data-modal-prefix-class="simple"</code> and <code>data-modal-prefix-class="simple-animated"</code> to namespace elements, so each one will start with <code>.simple-</code>/<code>.simple-animated-</code>:

```css
dialog {
  display: block;
  border: 0;
}
/* removes scroll when modal is opened */
.no-scroll {
  overflow: hidden;
}
/* overlay covers everything */
.simple-modal-overlay,
.simple-animated-modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #fff;
  opacity: .8;
  z-index: 666;
  cursor: pointer;
}
.simple-modal-overlay[data-background-click="disabled"],
.simple-animated-modal-overlay[data-background-click="disabled"] {
  cursor: auto;
}
.simple-animated-modal-overlay  {
  animation: fadewhite ease .5s 1 normal ;
}

@keyframes fadewhite {
  0% {
    opacity: 0;
  }
  100% {
    opacity: .8;
  }
}
/* modal */
.simple-modal,
.simple-animated-modal {
  position: fixed;
  left: 15%;
  top: 5%;
  width: 70%;
  max-height: 98vh;
  border: 2px solid #000;
  background: #fff;
  z-index: 667;
  padding: 2em;
  right: auto;
  overflow: auto;
}
.simple-modal-close,
.simple-animated-modal-close {
  float: right;
  background: #128197;
  border-radius: 1em;
  color: #fff;
  border: 0;
  font: inherit;
  padding: .25em .5em;
  cursor: pointer;
}
.simple-modal-close:focus,
.simple-modal-close:hover,
.simple-modal-close:active {
  outline: 1px dotted #fff;
}
.simple-modal-close:hover,
.simple-modal-close:active {
  background: #4d287f;
}

.simple-animated-modal {
  animation: apparition ease .5s 1 normal ;
}

@keyframes apparition {
  0% {
    opacity: 0;
    max-height: 0;
    width: 0;
    left: 50%;
  }
  100% {
    opacity: 1;
    max-height: 100%;
    width: 70%;
    left: 15%;
  }
}

/* it can be easily adapted in media-queries for tablets/mobile */

/* for this example: tablets */
@media (max-width: 55.625em) {

  .simple-modal,
  .simple-animated-modal {
    left: 5%;
    top: 5%;
    height: 90%;
    width: 90%;
  }

}

/* for this example: mobile */
@media (max-width: 44.375em) {

  .simple-modal,
  .simple-animated-modal {
    left: 1%;
    top: 1%;
    width: 98%;
    height: 98%;
  }

}
```


## Other style example

Here are the styles (unprefixed) used for the third example of the demo, I’ve used <code>data-modal-prefix-class="simple-left"</code> to namespace elements, so each one will start with <code>.simple-left-</code>:

```css
/* needed for old browsers */
dialog {
  display: block;
  border: 0;
}
/* removes scroll when modal is opened */
.no-scroll {
  overflow: hidden;
}

/* another modal styling example */
/* tooltip modal for it’s easy button */
.simple-left-modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #fff;
  opacity: .8;
  z-index: 666;
  cursor: pointer;
}
.simple-left-modal-overlay[data-background-click="disabled"] {
  cursor: auto;
}

.simple-left-modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, .8);
  opacity: .8;
  z-index: 666;
  cursor: pointer;
}

.simple-left-modal {
  left: auto;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: 667;
  position: fixed;
  width: 40em;
  max-width: 100%;
  padding: 0 1em 1em 1em;
  font-size: 1em;
  border: 0;
  overflow: auto;
  background-color: #aaa ; /* fallback CSS IE9 */
  background-image:
      -webkit-linear-gradient(
        top,
        #128197 3em,
        #f7f7f7 3em
      );  background-image:
      linear-gradient(
        to bottom,
        #128197 3em,
        #f7f7f7 3em
      );
  background-attachment: local;
}
.simple-left-modal-close {
  position: absolute;
  top: .5em;
  right: 0;
  background: transparent;
  color: #fff;
  border: 0;
  cursor: pointer;
}
.simple-left-modal-title {
  color: #fff;
  font-size: 1.5em;
}
```

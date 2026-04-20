const used = (func, obj) => (func(obj), obj);

const appendChildren = (el, child) => {
  if (Array.isArray(child)) {
    child.forEach((childN) => appendChildren(el, childN));
    return;
  }
  if (child === null || child === undefined || child === false) {
    return;
  }
  el.appendChild(
    typeof child === "object" ? child : document.createTextNode(String(child)),
  );
};

const __ = (tagName, { dataset, ...attrs } = {}, children) => {
  const el = document.createElement(tagName);
  Object.assign(el, attrs);
  Object.assign(el.dataset, dataset);
  appendChildren(el, children);
  return el;
};

class ContentsSidebar extends HTMLElement {
  documentEl;
  mainEl;
  menuButton;
  pages;
  base;

  constructor() {
    super();

    this.classList.add("Document-Sidebar");
    this.base =
      window.location.protocol === "https:" ? "/plain-forms-react" : "";
    this.pages = [
      {
        url: "/",
        text: "Plain-Forms-React",
      },
      // {
      //   url: "/usePlainValidation/",
      //   text: "usePlainValidation",
      // },
      // {
      //   url: "/Form/",
      //   text: "Form",
      // },
      // {
      //   url: "/ControlWrapper/",
      //   text: "ControlWrapper",
      // },
      // {
      //   url: "/SubmitBlocker/",
      //   text: "SubmitBlocker",
      // },
    ];
  }

  connectedCallback() {
    const onResize = () => {
      if (window.matchMedia("(min-width: 58rem)").matches) {
        this.documentEl.classList.add("Document_wideWindow");
        this.documentEl.classList.remove("Document_sidebarOpen");
        this.menuButton.tabIndex = -1;
      } else {
        this.documentEl.classList.remove("Document_wideWindow");
        this.menuButton.tabIndex = 0;
      }
    };

    document.addEventListener("DOMContentLoaded", () => {
      this.documentEl = document.querySelector(".Document");
      this.documentEl.classList.add("Document_withSidebarButton");
      this.menuButton = __("button", {
        className: "Document-MenuButton",
        innerHTML: `<svg viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
<rect y="0" width="5" height="1" fill="currentColor" />
<rect y="2" width="5" height="1" fill="currentColor" />
<rect y="4" width="5" height="1" fill="currentColor" />
</svg>`,
      });

      document
        .querySelector("header")
        .insertBefore(
          this.menuButton,
          document.querySelector("header > :first-child"),
        );

      this.menuButton.addEventListener("click", () =>
        this.documentEl.classList.toggle("Document_sidebarOpen"),
      );

      this.mainEl = document.querySelector(
        ":is(.Document main, main.Document)",
      );

      this.mainEl.addEventListener("click", () =>
        this.documentEl.classList.remove("Document_sidebarOpen"),
      );

      this.mainEl.addEventListener("focusin", () =>
        this.documentEl.classList.remove("Document_sidebarOpen"),
      );

      this.appendChild(
        __("ul", {}, [
          this.pages.map(({ url, text }) =>
            __(
              "li",
              {
                className: `Document-SidebarPage ${window.location.pathname === `${this.base}${url}` ? "Document-SidebarPage_active" : ""}`,
              },
              [
                __("p", {}, [
                  __(
                    "a",
                    {
                      href: `${this.base}${url}`,
                      className: "Document-Text_sansSerif",
                    },
                    [text],
                  ),
                ]),
              ],
            ),
          ),
        ]),
      );

      const activePage = document.querySelector(".Document-SidebarPage_active");
      let headers = [];
      let lists = [activePage];

      document
        .querySelectorAll("main :is(h2, h3, h4, h5, h6)")
        .forEach((el) => {
          const level = el.tagName[1] - 2;

          headers[level] = el.textContent
            .replaceAll(/[\s_]+/g, "_")
            .replaceAll(/[^\wЁё_-]/g, "");
          headers = headers.slice(0, level + 1);

          if (!el.id) {
            el.id = headers.join("__");
          }

          lists[level + 1] = __("ul", {}, [
            __("li", {}, [
              __("p", {}, [
                used(
                  (el) =>
                    el.addEventListener("click", (e) =>
                      this.documentEl.classList.remove("Document_sidebarOpen"),
                    ),
                  __(
                    "a",
                    { href: `#${el.id}`, className: "Document-Text_sansSerif" },
                    el.textContent,
                  ),
                ),
              ]),
            ]),
          ]);

          lists = lists.slice(0, level + 2);

          lists[level].appendChild(lists[level + 1]);
        });

      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onResize);

      onResize();
    });
  }
}

customElements.define("contents-sidebar", ContentsSidebar);

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 667})
    page.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page.evaluate("window.app.openGallery('yuta')")
    page.wait_for_timeout(300)

    info = page.evaluate("""() => {
        const wrap = document.querySelector('.gallery-tabs-wrap');
        const tabs = document.querySelector('.gallery-character-tabs');
        const firstBtn = document.querySelector('.gallery-tab-btn');
        const body = document.querySelector('.gallery-body');
        const modalContent = document.querySelector('.modal-content-gallery');
        
        return {
            modalContentHeight: modalContent.offsetHeight,
            wrap: {
                offsetHeight: wrap.offsetHeight,
                clientHeight: wrap.clientHeight,
                scrollHeight: wrap.scrollHeight,
                computedHeight: window.getComputedStyle(wrap).height,
                flexShrink: window.getComputedStyle(wrap).flexShrink,
                overflow: window.getComputedStyle(wrap).overflowX
            },
            tabs: {
                offsetHeight: tabs.offsetHeight,
                clientHeight: tabs.clientHeight
            },
            firstBtn: {
                offsetHeight: firstBtn.offsetHeight,
                clientHeight: firstBtn.clientHeight,
                computedFontSize: window.getComputedStyle(firstBtn).fontSize,
                computedLineHeight: window.getComputedStyle(firstBtn).lineHeight,
                computedPadding: window.getComputedStyle(firstBtn).padding,
                rect: firstBtn.getBoundingClientRect()
            },
            body: {
                offsetHeight: body.offsetHeight,
                rect: body.getBoundingClientRect()
            }
        };
    }""")
    print("DOM info:", info)
    browser.close()

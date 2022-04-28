const puppeteer = require('puppeteer'); // v13.0.0 or later

module.exports = async function(dados_ponto) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    async function waitForSelectors(selectors, frame, options) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame, options);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function scrollIntoViewIfNeeded(element, timeout) {
      await waitForConnected(element, timeout);
      const isInViewport = await element.isIntersectingViewport({threshold: 0});
      if (isInViewport) {
        return;
      }
      await element.evaluate(element => {
        element.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'auto',
        });
      });
      await waitForInViewport(element, timeout);
    }

    async function waitForConnected(element, timeout) {
      await waitForFunction(async () => {
        return await element.getProperty('isConnected');
      }, timeout);
    }

    async function waitForInViewport(element, timeout) {
      await waitForFunction(async () => {
        return await element.isIntersectingViewport({threshold: 0});
      }, timeout);
    }

    async function waitForSelector(selector, frame, options) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to waitForSelector');
      }
      let element = null;
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (element) {
          element = await element.waitForSelector(part, options);
        } else {
          element = await frame.waitForSelector(part, options);
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('>>'));
        }
        if (i < selector.length - 1) {
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('|'));
      }
      return element;
    }

    async function waitForElement(step, frame, timeout) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      }, timeout);
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to querySelectorAll');
      }
      let elements = [];
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        if (i < selector.length - 1) {
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
        }
      }
      return elements;
    }

    async function waitForFunction(fn, timeout) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, timeout);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":1631,"height":968})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://portalrholiveiratrust.cloudmetadados.com.br/PortalRH/Account/Login?ReturnUrl=%2fPortalRH%2fAccount');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Usuário"],["#usuario"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type(dados_ponto.username);
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "13864107725");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Senha"],["#senha"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type(dados_ponto.password);
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "123456");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/ENTRAR"],["#btnLogin"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 150.203125, y: 25.453125} });
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/Ir para a Home"],["body > div > div > div > div > div > a"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 89.125, y: 11.703125} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/ Minhas Solicitações"],["#sidebar-menu > div > ul > li:nth-child(5) > a"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 142, y: 22.609375} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Abrir nova solicitação"],["#btnNovoSolicitacao"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 130, y: 14.609375} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Iniciar Solicitação"],["#ModalNotificacao > div > div > div.modal-body > div > div > div > form > div > div:nth-child(3) > input"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 36, y: 14.296875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["body > div > div.main_container > div.right_col > div > div.row > div > div > div.x_content > div > form > div:nth-child(6) > div.col-md-6.col-lg-6.col-lgx-5.col-sm-12.col-xs-12 > div > span > i"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 2.5, y: 7.609375} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["body > div > div.main_container > div.right_col > div > div.row > div > div > div.x_content > div > form > div:nth-child(6) > div.col-md-6.col-lg-6.col-lgx-5.col-sm-12.col-xs-12 > div > div > ul > li:nth-child(1) > div > div.datepicker-days > table > tbody > tr:nth-child(5) > td.day.active.today"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 12.75, y: 16.609375} });
    }

    {
      const targetPage = page;
      const element = await waitForSelectors([["aria/Abono do Gestor[role=\"generic\"]"],["#select2-ctl-977ff251-74a6-4521-b181-eb74b91ed409-container"]], targetPage, { timeout, visible: true });
      await scrollIntoViewIfNeeded(element, timeout);
      await element.click({ offset: { x: 145.3125, y: 6.609375} });
  }
  {
      const targetPage = page;
      const element = await waitForSelectors([["body > span > span > span.select2-search.select2-search--dropdown > input"]], targetPage, { timeout, visible: true });
      await scrollIntoViewIfNeeded(element, timeout);
      await element.click({ offset: { x: 118.3125, y: 20.609375} });
  }
  {
      const targetPage = page;
      const element = await waitForSelectors([["body > span > span > span.select2-search.select2-search--dropdown > input"]], targetPage, { timeout, visible: true });
      await scrollIntoViewIfNeeded(element, timeout);
      const type = await element.evaluate(el => el.type);
      if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
        await element.type('home');
      } else {
        await element.focus();
        await element.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, "home");
      }
  }
  {
      const targetPage = page;
      await targetPage.keyboard.down("Enter");
  }
  {
      const targetPage = page;
      await targetPage.keyboard.up("Enter");
  }

    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Hora Marcação I"],["#ctl-49c05db4-1357-45be-bb10-2b87369b52ed"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 12.3125, y: 14.609375} });
    }
    {
        const targetPage = page;
        let frame = targetPage.mainFrame();
        const element = await waitForSelectors([["aria/Hora Marcação I"],["#ctl-49c05db4-1357-45be-bb10-2b87369b52ed"]], frame, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type(dados_ponto.horario_entrada);
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, dados_ponto.horario_entrada);
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Hora Marcação II"],["#ctl-5ce217af-7acd-490c-b505-c77b331af248"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 17.3125, y: 12.609375} });
    }
    {
        const targetPage = page;
        let frame = targetPage.mainFrame();
        const element = await waitForSelectors([["aria/Hora Marcação II"],["#ctl-5ce217af-7acd-490c-b505-c77b331af248"]], frame, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type(dados_ponto.horario_entrada_intervalo);
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, dados_ponto.horario_entrada_intervalo);
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Hora Marcação III"],["#ctl-ac09ce86-1e70-4a1d-a567-1c54699bf748"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 16.3125, y: 10.609375} });
    }
    {
        const targetPage = page;
        let frame = targetPage.mainFrame();
        const element = await waitForSelectors([["aria/Hora Marcação III"],["#ctl-ac09ce86-1e70-4a1d-a567-1c54699bf748"]], frame, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type(dados_ponto.horario_saido_intervalo);
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, dados_ponto.horario_saido_intervalo);
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Hora Marcação IV"],["#ctl-fb2f7dba-de53-4155-a1c7-4988cc14310e"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 11.3125, y: 10.609375} });
    }
    {
        const targetPage = page;
        let frame = targetPage.mainFrame();
        const element = await waitForSelectors([["aria/Hora Marcação IV"],["#ctl-fb2f7dba-de53-4155-a1c7-4988cc14310e"]], frame, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type(dados_ponto.horario_saida);
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, dados_ponto.horario_saida);
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Detalhamento"],["#Detalhamento"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 191.3125, y: 28.609375} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Detalhamento"],["#Detalhamento"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('home office');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "home office");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Enviar Solicitação"],["#btnEnviar"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 76, y: 17.796875} });
        await targetPage.waitForNavigation()
    }
    await browser.close();
}
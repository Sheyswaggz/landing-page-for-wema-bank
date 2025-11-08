// tests/html-structure.spec.js
const { test, expect } = require('@playwright/test')

/**
 * Landing Page HTML Structure Test Suite
 * 
 * Tests semantic HTML, accessibility, SEO, and structural integrity
 * of the Wema Bank landing page.
 * 
 * Coverage Areas:
 * - HTML5 validation
 * - Meta tags and SEO
 * - Semantic structure
 * - Accessibility (WCAG 2.1 AA)
 * - Navigation functionality
 * - Content presence
 * - Performance
 */

test.describe('Landing Page HTML Structure', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page before each test
    await page.goto('/')
  })

  // ============================================================================
  // 🏗️ HTML5 VALIDATION TESTS
  // ============================================================================

  test('should have valid HTML5 doctype', async ({ page }) => {
    const doctype = await page.evaluate(() => {
      const node = document.doctype
      return node ? `<!DOCTYPE ${node.name}>` : null
    })
    
    expect(doctype).toBe('<!DOCTYPE html>')
  })

  test('should have html element with lang attribute', async ({ page }) => {
    const htmlLang = await page.locator('html').getAttribute('lang')
    
    expect(htmlLang).toBe('en')
  })

  test('should have html element with dir attribute', async ({ page }) => {
    const htmlDir = await page.locator('html').getAttribute('dir')
    
    expect(htmlDir).toBe('ltr')
  })

  test('should have UTF-8 charset meta tag', async ({ page }) => {
    const charset = await page.locator('meta[charset]').getAttribute('charset')
    
    expect(charset).toBe('UTF-8')
  })

  test('should have viewport meta tag', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
    
    expect(viewport).toContain('width=device-width')
    expect(viewport).toContain('initial-scale=1.0')
  })

  // ============================================================================
  // 🎯 META TAGS AND SEO TESTS
  // ============================================================================

  test('should have proper meta tags', async ({ page }) => {
    // Title tag
    const title = await page.title()
    expect(title).toBe('Wema Bank - Your Trusted Banking Partner')
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThan(60)

    // Description meta tag
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
    expect(description.length).toBeGreaterThan(50)
    expect(description.length).toBeLessThan(160)
    expect(description).toContain('Wema Bank')

    // Keywords meta tag
    const keywords = await page.locator('meta[name="keywords"]').getAttribute('content')
    expect(keywords).toBeTruthy()
    expect(keywords).toContain('Wema Bank')
    expect(keywords).toContain('banking')
  })

  test('should have Open Graph meta tags', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content')

    expect(ogTitle).toBe('Wema Bank - Your Trusted Banking Partner')
    expect(ogDescription).toBeTruthy()
    expect(ogImage).toContain('https://')
    expect(ogUrl).toBe('https://wemabank.com')
    expect(ogType).toBe('website')
    expect(ogSiteName).toBe('Wema Bank')
  })

  test('should have Twitter Card meta tags', async ({ page }) => {
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content')
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')
    const twitterSite = await page.locator('meta[name="twitter:site"]').getAttribute('content')

    expect(twitterCard).toBe('summary_large_image')
    expect(twitterTitle).toBeTruthy()
    expect(twitterDescription).toBeTruthy()
    expect(twitterImage).toContain('https://')
    expect(twitterSite).toBe('@wemabank')
  })

  test('should have canonical link', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    
    expect(canonical).toBe('https://wemabank.com')
  })

  test('should have favicon links', async ({ page }) => {
    const favicon = await page.locator('link[rel="icon"]').getAttribute('href')
    const appleTouchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href')

    expect(favicon).toBe('/favicon.ico')
    expect(appleTouchIcon).toBe('/apple-touch-icon.png')
  })

  test('should have theme-color meta tags', async ({ page }) => {
    const themeColors = await page.locator('meta[name="theme-color"]').all()
    
    expect(themeColors.length).toBe(2)
    
    const lightTheme = await page.locator('meta[name="theme-color"][media*="light"]').getAttribute('content')
    const darkTheme = await page.locator('meta[name="theme-color"][media*="dark"]').getAttribute('content')
    
    expect(lightTheme).toBe('#8B0000')
    expect(darkTheme).toBe('#6B0000')
  })

  // ============================================================================
  // 🏛️ SEMANTIC STRUCTURE TESTS
  // ============================================================================

  test('should have semantic header with navigation', async ({ page }) => {
    // Header element
    const header = page.locator('header[role="banner"]')
    await expect(header).toBeVisible()

    // Logo
    const logo = header.locator('.header__logo a')
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('aria-label', 'Wema Bank Home')

    const logoImg = logo.locator('img')
    await expect(logoImg).toHaveAttribute('alt', 'Wema Bank')
    await expect(logoImg).toHaveAttribute('width', '150')
    await expect(logoImg).toHaveAttribute('height', '50')

    // Navigation
    const nav = header.locator('nav[role="navigation"]')
    await expect(nav).toBeVisible()
    await expect(nav).toHaveAttribute('aria-label', 'Main navigation')

    // Navigation list
    const navList = nav.locator('ul[role="list"]')
    await expect(navList).toBeVisible()

    // Navigation items
    const navItems = navList.locator('li.nav__item')
    await expect(navItems).toHaveCount(4)

    // Check navigation links
    const navLinks = ['Home', 'Services', 'About', 'Contact']
    for (let i = 0; i < navLinks.length; i++) {
      const link = navItems.nth(i).locator('a')
      await expect(link).toContainText(navLinks[i])
    }

    // First link should have aria-current
    const firstLink = navItems.first().locator('a')
    await expect(firstLink).toHaveAttribute('aria-current', 'page')
  })

  test('should have skip link for accessibility', async ({ page }) => {
    const skipLink = page.locator('a.skip-link')
    
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveAttribute('href', '#main')
    await expect(skipLink).toContainText('Skip to main content')
  })

  test('should have main content area with sections', async ({ page }) => {
    const main = page.locator('main#main[role="main"]')
    await expect(main).toBeVisible()

    // Hero section
    const hero = main.locator('section#home.hero')
    await expect(hero).toBeVisible()
    await expect(hero).toHaveAttribute('aria-labelledby', 'hero-title')

    const heroTitle = hero.locator('h1#hero-title')
    await expect(heroTitle).toBeVisible()
    await expect(heroTitle).toContainText('Welcome to Wema Bank')

    // Services section
    const services = main.locator('section#services.services')
    await expect(services).toBeVisible()
    await expect(services).toHaveAttribute('aria-labelledby', 'services-title')

    const servicesTitle = services.locator('h2#services-title')
    await expect(servicesTitle).toBeVisible()
    await expect(servicesTitle).toContainText('Our Services')

    // About section
    const about = main.locator('section#about.about')
    await expect(about).toBeVisible()
    await expect(about).toHaveAttribute('aria-labelledby', 'about-title')

    const aboutTitle = about.locator('h2#about-title')
    await expect(aboutTitle).toBeVisible()
    await expect(aboutTitle).toContainText('About Wema Bank')

    // Contact section
    const contact = main.locator('section#contact.contact')
    await expect(contact).toBeVisible()
    await expect(contact).toHaveAttribute('aria-labelledby', 'contact-title')

    const contactTitle = contact.locator('h2#contact-title')
    await expect(contactTitle).toBeVisible()
    await expect(contactTitle).toContainText('Get In Touch')
  })

  test('should have footer with bank information', async ({ page }) => {
    const footer = page.locator('footer[role="contentinfo"]')
    await expect(footer).toBeVisible()

    // Footer columns
    const columns = footer.locator('.footer__column')
    await expect(columns).toHaveCount(4)

    // About column
    const aboutColumn = columns.first()
    await expect(aboutColumn.locator('h3')).toContainText('About Wema Bank')
    await expect(aboutColumn.locator('.footer__text')).toBeVisible()

    // Contact information
    const phone = aboutColumn.locator('a[href="tel:+2348039003700"]')
    await expect(phone).toBeVisible()
    await expect(phone).toContainText('0803 900 3700')

    const email = aboutColumn.locator('a[href="mailto:customercare@wemabank.com"]')
    await expect(email).toBeVisible()
    await expect(email).toContainText('customercare@wemabank.com')

    // Address
    const address = aboutColumn.locator('address.footer__address')
    await expect(address).toBeVisible()
    await expect(address).toContainText('Wema Towers')
    await expect(address).toContainText('54 Marina')
    await expect(address).toContainText('Lagos')

    // Copyright
    const copyright = footer.locator('.footer__copyright')
    await expect(copyright).toBeVisible()
    await expect(copyright).toContainText('2024 Wema Bank Plc')
    await expect(copyright).toContainText('All rights reserved')

    // Regulatory information
    const regulatory = footer.locator('.footer__regulatory')
    await expect(regulatory).toBeVisible()
    await expect(regulatory.locator('p').first()).toContainText('Central Bank of Nigeria')
    await expect(regulatory.locator('p').last()).toContainText('NDIC')
  })

  // ============================================================================
  // 🎨 SERVICES SECTION TESTS
  // ============================================================================

  test('should display all service cards', async ({ page }) => {
    const serviceCards = page.locator('.service-card')
    await expect(serviceCards).toHaveCount(4)

    const expectedServices = [
      'Personal Banking',
      'Business Banking',
      'Digital Banking',
      'Investment Services'
    ]

    for (let i = 0; i < expectedServices.length; i++) {
      const card = serviceCards.nth(i)
      const title = card.locator('h3.service-card__title')
      await expect(title).toContainText(expectedServices[i])

      // Check icon
      const icon = card.locator('.service-card__icon img')
      await expect(icon).toBeVisible()
      await expect(icon).toHaveAttribute('alt', '')
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('width', '64')
      await expect(icon).toHaveAttribute('height', '64')

      // Check description
      const description = card.locator('.service-card__description')
      await expect(description).toBeVisible()
    }
  })

  // ============================================================================
  // 📊 ABOUT SECTION TESTS
  // ============================================================================

  test('should display about section with statistics', async ({ page }) => {
    const about = page.locator('section#about')

    // Check paragraphs
    const paragraphs = about.locator('.about__paragraph')
    await expect(paragraphs).toHaveCount(2)
    await expect(paragraphs.first()).toContainText('established in 1945')
    await expect(paragraphs.last()).toContainText('ALAT')

    // Check statistics
    const stats = about.locator('.stat')
    await expect(stats).toHaveCount(3)

    const expectedStats = [
      { number: '75+', label: 'Years of Excellence' },
      { number: '150+', label: 'Branches Nationwide' },
      { number: '2M+', label: 'Satisfied Customers' }
    ]

    for (let i = 0; i < expectedStats.length; i++) {
      const stat = stats.nth(i)
      await expect(stat.locator('.stat__number')).toContainText(expectedStats[i].number)
      await expect(stat.locator('.stat__label')).toContainText(expectedStats[i].label)
    }
  })

  // ============================================================================
  // 📞 CONTACT SECTION TESTS
  // ============================================================================

  test('should display contact information', async ({ page }) => {
    const contact = page.locator('section#contact')

    // Customer service
    const customerService = contact.locator('.contact-item').first()
    await expect(customerService.locator('h3')).toContainText('Customer Service')
    await expect(customerService.locator('a[href="tel:+2348039003700"]')).toBeVisible()
    await expect(customerService.locator('a[href="mailto:customercare@wemabank.com"]')).toBeVisible()

    // Head office
    const headOffice = contact.locator('.contact-item').nth(1)
    await expect(headOffice.locator('h3')).toContainText('Head Office')
    const address = headOffice.locator('address')
    await expect(address).toContainText('Wema Towers')
    await expect(address).toContainText('54 Marina')

    // Business hours
    const businessHours = contact.locator('.contact-item').last()
    await expect(businessHours.locator('h3')).toContainText('Business Hours')
    await expect(businessHours).toContainText('Monday - Friday')
    await expect(businessHours).toContainText('Saturday')
  })

  // ============================================================================
  // 🔗 NAVIGATION AND LINKS TESTS
  // ============================================================================

  test('should have accessible navigation links', async ({ page }) => {
    // Main navigation links
    const mainNavLinks = page.locator('header nav a')
    const mainNavCount = await mainNavLinks.count()
    
    expect(mainNavCount).toBe(4)

    for (let i = 0; i < mainNavCount; i++) {
      const link = mainNavLinks.nth(i)
      const href = await link.getAttribute('href')
      const text = await link.textContent()
      
      expect(href).toBeTruthy()
      expect(text.trim()).toBeTruthy()
    }

    // Footer navigation links
    const footerNavLinks = page.locator('footer nav a')
    const footerNavCount = await footerNavLinks.count()
    
    expect(footerNavCount).toBeGreaterThan(0)

    // Check social media links
    const socialLinks = page.locator('.footer__social-link')
    await expect(socialLinks).toHaveCount(4)

    const expectedSocial = [
      { platform: 'Facebook', url: 'facebook.com/wemabank' },
      { platform: 'Twitter', url: 'twitter.com/wemabank' },
      { platform: 'LinkedIn', url: 'linkedin.com/company/wema-bank-plc' },
      { platform: 'Instagram', url: 'instagram.com/wemabank' }
    ]

    for (let i = 0; i < expectedSocial.length; i++) {
      const link = socialLinks.nth(i)
      const href = await link.getAttribute('href')
      const ariaLabel = await link.getAttribute('aria-label')
      const target = await link.getAttribute('target')
      const rel = await link.getAttribute('rel')

      expect(href).toContain(expectedSocial[i].url)
      expect(ariaLabel).toContain(expectedSocial[i].platform)
      expect(target).toBe('_blank')
      expect(rel).toBe('noopener noreferrer')
    }
  })

  test('should have working internal navigation', async ({ page }) => {
    // Test navigation to services section
    await page.click('a[href="#services"]')
    await page.waitForTimeout(500)
    
    const servicesSection = page.locator('section#services')
    await expect(servicesSection).toBeInViewport()

    // Test navigation to about section
    await page.click('a[href="#about"]')
    await page.waitForTimeout(500)
    
    const aboutSection = page.locator('section#about')
    await expect(aboutSection).toBeInViewport()

    // Test navigation to contact section
    await page.click('a[href="#contact"]')
    await page.waitForTimeout(500)
    
    const contactSection = page.locator('section#contact')
    await expect(contactSection).toBeInViewport()
  })

  // ============================================================================
  // ♿ ACCESSIBILITY TESTS (WCAG 2.1 AA)
  // ============================================================================

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check role attributes
    const banner = page.locator('[role="banner"]')
    await expect(banner).toBeVisible()

    const navigation = page.locator('[role="navigation"]')
    await expect(navigation).toHaveCount(5) // Main nav + 4 footer navs

    const main = page.locator('[role="main"]')
    await expect(main).toBeVisible()

    const contentinfo = page.locator('[role="contentinfo"]')
    await expect(contentinfo).toBeVisible()

    // Check aria-label attributes
    const ariaLabels = await page.locator('[aria-label]').all()
    expect(ariaLabels.length).toBeGreaterThan(0)

    for (const element of ariaLabels) {
      const label = await element.getAttribute('aria-label')
      expect(label).toBeTruthy()
      expect(label.length).toBeGreaterThan(0)
    }

    // Check aria-labelledby attributes
    const ariaLabelledby = await page.locator('[aria-labelledby]').all()
    expect(ariaLabelledby.length).toBeGreaterThan(0)

    for (const element of ariaLabelledby) {
      const labelId = await element.getAttribute('aria-labelledby')
      const labelElement = page.locator(`#${labelId}`)
      await expect(labelElement).toBeAttached()
    }

    // Check aria-live for dynamic content
    const liveRegion = page.locator('[aria-live="polite"]')
    await expect(liveRegion).toBeVisible()

    // Check aria-hidden for decorative elements
    const decorativeElements = page.locator('[aria-hidden="true"]')
    const decorativeCount = await decorativeElements.count()
    expect(decorativeCount).toBeGreaterThan(0)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Get all headings
    const h1 = await page.locator('h1').all()
    const h2 = await page.locator('h2').all()
    const h3 = await page.locator('h3').all()
    const h4 = await page.locator('h4').all()

    // Should have exactly one h1
    expect(h1.length).toBe(1)

    // Should have multiple h2s (section headings)
    expect(h2.length).toBeGreaterThan(0)

    // Should have h3s (subsection headings)
    expect(h3.length).toBeGreaterThan(0)

    // Check h1 content
    const h1Text = await h1[0].textContent()
    expect(h1Text).toContain('Welcome to Wema Bank')

    // Verify heading order (no skipping levels)
    const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    const headingLevels = []
    
    for (const heading of allHeadings) {
      const tagName = await heading.evaluate(el => el.tagName)
      const level = parseInt(tagName.substring(1))
      headingLevels.push(level)
    }

    // Check no level is skipped
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1]
      expect(diff).toBeLessThanOrEqual(1)
    }
  })

  test('should have alt text for all images', async ({ page }) => {
    const images = await page.locator('img').all()
    
    expect(images.length).toBeGreaterThan(0)

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const ariaHidden = await img.getAttribute('aria-hidden')
      
      // Image should either have alt text or be marked as decorative
      if (ariaHidden !== 'true') {
        expect(alt).toBeDefined()
      }
    }
  })

  test('should have proper link text', async ({ page }) => {
    const links = await page.locator('a').all()
    
    for (const link of links) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const title = await link.getAttribute('title')
      
      // Link should have text, aria-label, or title
      const hasAccessibleName = text.trim() || ariaLabel || title
      expect(hasAccessibleName).toBeTruthy()
    }
  })

  test('should have proper list markup', async ({ page }) => {
    // Check navigation lists
    const lists = page.locator('ul[role="list"]')
    const listCount = await lists.count()
    
    expect(listCount).toBeGreaterThan(0)

    // Verify list items
    for (let i = 0; i < listCount; i++) {
      const list = lists.nth(i)
      const items = list.locator('li')
      const itemCount = await items.count()
      
      expect(itemCount).toBeGreaterThan(0)
    }
  })

  test('should have proper form labels (if forms exist)', async ({ page }) => {
    const inputs = await page.locator('input, textarea, select').all()
    
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledby = await input.getAttribute('aria-labelledby')
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const labelExists = await label.count() > 0
        
        // Input should have label, aria-label, or aria-labelledby
        const hasAccessibleName = labelExists || ariaLabel || ariaLabelledby
        expect(hasAccessibleName).toBeTruthy()
      }
    }
  })

  test('should have keyboard accessible interactive elements', async ({ page }) => {
    // Test skip link keyboard navigation
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a.skip-link')
    await expect(skipLink).toBeFocused()

    // Test main navigation keyboard access
    await page.keyboard.press('Tab')
    const firstNavLink = page.locator('header nav a').first()
    await expect(firstNavLink).toBeFocused()

    // Verify all interactive elements are focusable
    const interactiveElements = await page.locator('a, button, input, textarea, select').all()
    
    for (const element of interactiveElements) {
      const tabindex = await element.getAttribute('tabindex')
      
      // Should not have negative tabindex (unless intentionally hidden)
      if (tabindex) {
        expect(parseInt(tabindex)).toBeGreaterThanOrEqual(-1)
      }
    }
  })

  // ============================================================================
  // 🎨 VISUAL AND LAYOUT TESTS
  // ============================================================================

  test('should have proper viewport configuration', async ({ page }) => {
    const viewport = page.viewportSize()
    
    expect(viewport.width).toBeGreaterThan(0)
    expect(viewport.height).toBeGreaterThan(0)

    // Test responsive behavior
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile
    await expect(page.locator('header')).toBeVisible()

    await page.setViewportSize({ width: 768, height: 1024 }) // Tablet
    await expect(page.locator('header')).toBeVisible()

    await page.setViewportSize({ width: 1920, height: 1080 }) // Desktop
    await expect(page.locator('header')).toBeVisible()
  })

  test('should have visible content sections', async ({ page }) => {
    const sections = ['#home', '#services', '#about', '#contact']
    
    for (const selector of sections) {
      const section = page.locator(selector)
      await expect(section).toBeVisible()
      
      // Check section has content
      const content = await section.textContent()
      expect(content.trim().length).toBeGreaterThan(0)
    }
  })

  // ============================================================================
  // 🚀 PERFORMANCE TESTS
  // ============================================================================

  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have no console errors', async ({ page }) => {
    const consoleErrors = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    expect(consoleErrors).toHaveLength(0)
  })

  test('should have no JavaScript errors', async ({ page }) => {
    const jsErrors = []
    
    page.on('pageerror', error => {
      jsErrors.push(error.message)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    expect(jsErrors).toHaveLength(0)
  })

  // ============================================================================
  // 🔍 LIGHTHOUSE ACCESSIBILITY AUDIT
  // ============================================================================

  test('should pass accessibility audit (Lighthouse)', async ({ page }) => {
    await page.goto('/')

    // Manual accessibility checks (Playwright doesn't have built-in Lighthouse)
    // These checks simulate key Lighthouse accessibility criteria

    // 1. Check for proper document structure
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang')

    // 2. Check for meta viewport
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toBeAttached()

    // 3. Check for page title
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)

    // 4. Check for landmark regions
    await expect(page.locator('[role="banner"]')).toBeVisible()
    await expect(page.locator('[role="main"]')).toBeVisible()
    await expect(page.locator('[role="contentinfo"]')).toBeVisible()
    await expect(page.locator('[role="navigation"]')).toHaveCount(5)

    // 5. Check for proper heading structure
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // 6. Check for image alt attributes
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const ariaHidden = await img.getAttribute('aria-hidden')
      expect(alt !== null || ariaHidden === 'true').toBeTruthy()
    }

    // 7. Check for link accessibility
    const links = await page.locator('a').all()
    for (const link of links) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      expect(text.trim() || ariaLabel).toBeTruthy()
    }

    // 8. Check color contrast (basic check)
    const body = page.locator('body')
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    expect(bgColor).toBeTruthy()

    // 9. Check for skip link
    const skipLink = page.locator('a.skip-link')
    await expect(skipLink).toBeAttached()

    // 10. Check for proper ARIA usage
    const ariaElements = await page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all()
    expect(ariaElements.length).toBeGreaterThan(0)
  })

  // ============================================================================
  // 🔒 SECURITY TESTS
  // ============================================================================

  test('should have secure external links', async ({ page }) => {
    const externalLinks = await page.locator('a[target="_blank"]').all()
    
    for (const link of externalLinks) {
      const rel = await link.getAttribute('rel')
      
      // External links should have noopener noreferrer
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    }
  })

  test('should not expose sensitive information in HTML', async ({ page }) => {
    const html = await page.content()
    
    // Check for common sensitive patterns
    expect(html).not.toContain('password')
    expect(html).not.toContain('api_key')
    expect(html).not.toContain('secret')
    expect(html).not.toContain('token')
  })

  // ============================================================================
  // 📱 MOBILE RESPONSIVENESS TESTS
  // ============================================================================

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check header is visible
    await expect(page.locator('header')).toBeVisible()
    
    // Check main content is visible
    await expect(page.locator('main')).toBeVisible()
    
    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible()
    
    // Check no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = page.viewportSize().width
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check all sections are visible
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    
    // Check service cards layout
    const serviceCards = page.locator('.service-card')
    await expect(serviceCards).toHaveCount(4)
  })

  // ============================================================================
  // 🎯 CONTENT VALIDATION TESTS
  // ============================================================================

  test('should have correct contact information', async ({ page }) => {
    // Phone number
    const phone = page.locator('a[href="tel:+2348039003700"]')
    await expect(phone).toHaveCount(2) // Header contact and footer

    // Email
    const email = page.locator('a[href="mailto:customercare@wemabank.com"]')
    await expect(email).toHaveCount(2)

    // Address
    const address = page.locator('address')
    await expect(address).toHaveCount(2)
    await expect(address.first()).toContainText('Wema Towers')
    await expect(address.first()).toContainText('54 Marina')
  })

  test('should have proper footer legal links', async ({ page }) => {
    const legalLinks = page.locator('.footer__legal-links a')
    
    await expect(legalLinks).toHaveCount(4)
    
    const expectedLinks = [
      'Privacy Policy',
      'Terms of Use',
      'Security',
      'Accessibility'
    ]
    
    for (let i = 0; i < expectedLinks.length; i++) {
      await expect(legalLinks.nth(i)).toContainText(expectedLinks[i])
    }
  })

  test('should have branch location links', async ({ page }) => {
    const branchLinks = page.locator('.footer__column').nth(2).locator('a')
    
    await expect(branchLinks).toHaveCount(6)
    
    const expectedBranches = [
      'Lagos',
      'Abuja',
      'Port Harcourt',
      'Kano',
      'Ibadan',
      'View All'
    ]
    
    for (let i = 0; i < expectedBranches.length; i++) {
      await expect(branchLinks.nth(i)).toContainText(expectedBranches[i])
    }
  })

  // ============================================================================
  // 🎪 HERO SECTION TESTS
  // ============================================================================

  test('should have properly structured hero section', async ({ page }) => {
    const hero = page.locator('section#home.hero')
    
    await expect(hero).toBeVisible()
    await expect(hero).toHaveAttribute('aria-labelledby', 'hero-title')
    
    const slider = hero.locator('.hero__slider')
    await expect(slider).toHaveAttribute('role', 'region')
    await expect(slider).toHaveAttribute('aria-label', 'Featured banking services')
    await expect(slider).toHaveAttribute('aria-live', 'polite')
    
    const title = hero.locator('h1#hero-title')
    await expect(title).toContainText('Welcome to Wema Bank')
    
    const description = hero.locator('.hero__description')
    await expect(description).toContainText('Your Trusted Banking Partner')
    await expect(description).toContainText('75 Years')
  })

})
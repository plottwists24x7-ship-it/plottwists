/**
 * PLOTTWIST BAKERY: Automated Verification Suite for All 5 Tables CRUD + Auth + Proxy + CSRF
 */

const fs = require('fs');
const path = require('path');

// Load environment from .env.local
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
});

const BASE_URL = 'http://localhost:3000';
const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('❌ Missing ADMIN_PASSWORD in .env.local');
  process.exit(1);
}

let sessionCookie = '';

async function run() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 STARTING COMPREHENSIVE INTEGRATION & CRUD TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // ─── 1. AUTHENTICATION & SESSION TESTS ───
  console.log('▶ TEST SUITE 1: Admin Authentication & Session Management');
  {
    // A. Invalid password
    const badLogin = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password-xyz' }),
    });
    assert(badLogin.status === 401, 'Invalid password is rejected with HTTP 401');

    // B. Valid password
    const goodLogin = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    assert(goodLogin.status === 200, 'Valid password succeeds with HTTP 200');

    const setCookie = goodLogin.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('admin_session='), 'Admin session cookie issued');
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }

    // C. Verify session API
    const sessionCheck = await fetch(`${BASE_URL}/api/admin/session`, {
      headers: { Cookie: sessionCookie },
    });
    assert(sessionCheck.status === 200, 'Session endpoint returns HTTP 200 with valid cookie');
    const sessionJson = await sessionCheck.json();
    assert(sessionJson.authenticated === true, 'Session endpoint confirms authenticated: true');
  }

  // ─── 2. PROXY & MIDDLEWARE ROUTING TESTS ───
  console.log('\n▶ TEST SUITE 2: Proxy (Middleware) Protection & Protocol Preservation');
  {
    // A. Unauthenticated request to /admin/bakes should redirect
    const unauthReq = await fetch(`${BASE_URL}/admin/bakes`, {
      redirect: 'manual',
    });
    assert(
      unauthReq.status === 307 || unauthReq.status === 308 || unauthReq.status === 302,
      `Unauthenticated access redirected (HTTP ${unauthReq.status})`
    );
    const loc = unauthReq.headers.get('location') || '';
    assert(loc.includes('/admin/login'), `Redirect points to /admin/login (${loc})`);

    // B. Authenticated request to /admin/bakes should succeed
    const authReq = await fetch(`${BASE_URL}/admin/bakes`, {
      headers: { Cookie: sessionCookie },
    });
    assert(authReq.status === 200, 'Authenticated admin page access returns HTTP 200');
  }

  // ─── 3. CSRF & REVERSE-PROXY ORIGIN TESTS ───
  console.log('\n▶ TEST SUITE 3: CSRF & Trusted-Origin Security');
  {
    // A. Malicious foreign origin should be rejected with 403
    const csrfAttack = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'https://attacker-website.evil.com',
      },
      body: JSON.stringify({ name: 'Malicious Item' }),
    });
    assert(csrfAttack.status === 403, 'Foreign origin on state mutation rejected with HTTP 403');

    // B. Valid Origin matching localhost
    const validOriginReq = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({}), // will fail validation but pass CSRF guard
    });
    assert(
      validOriginReq.status === 400,
      'Valid Origin allowed through CSRF check (failed only on payload validation: HTTP 400)'
    );

    // C. Vercel edge reverse proxy x-forwarded-host matching
    const vercelProxyReq = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'https://mybakery.vercel.app',
        'X-Forwarded-Host': 'mybakery.vercel.app, proxy-edge.vercel.com',
      },
      body: JSON.stringify({}),
    });
    assert(
      vercelProxyReq.status === 400,
      'Vercel proxy x-forwarded-host safely matched and permitted through CSRF check'
    );
  }

  // ─── 4. TABLE 1: PRODUCTS CRUD TESTS ───
  console.log('\n▶ TEST SUITE 4: Table 1 (products) Server-Side CRUD');
  let testProductId = null;
  {
    // GET
    const getRes = await fetch(`${BASE_URL}/api/admin/products`, {
      headers: { Cookie: sessionCookie },
    });
    assert(getRes.status === 200, 'GET /api/admin/products returns HTTP 200');
    const getJson = await getRes.json();
    assert(Array.isArray(getJson.data), `Fetched ${getJson.data?.length} existing products`);

    // POST
    const postRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        name: 'Automated Test Product',
        description: 'Temporary item for verification',
        image: '/images/baker-where/prod_pancakes.jpg',
        price: '₹240',
        category: 'Pastries',
        is_popular: false,
        is_bestseller: false,
      }),
    });
    assert(postRes.status === 200, 'POST /api/admin/products creates product (HTTP 200)');
    const postJson = await postRes.json();
    testProductId = postJson.data?.id;
    assert(Boolean(testProductId), `Created test product ID: ${testProductId}`);

    // PATCH
    const patchRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        id: testProductId,
        updates: {
          name: 'Automated Test Product UPDATED',
          price: '₹280',
        },
      }),
    });
    assert(patchRes.status === 200, 'PATCH /api/admin/products updates product (HTTP 200)');
    const patchJson = await patchRes.json();
    assert(patchJson.data?.name === 'Automated Test Product UPDATED', 'Updated product name verified');

    // DELETE
    const delRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ id: testProductId }),
    });
    assert(delRes.status === 200, 'DELETE /api/admin/products deletes product (HTTP 200)');

    // Verify deletion
    const verifyDel = await fetch(`${BASE_URL}/api/admin/products?id=${testProductId}`, {
      headers: { Cookie: sessionCookie },
    });
    const verifyJson = await verifyDel.json();
    assert(!verifyJson.data, 'Product record confirmed deleted from Supabase');
  }

  // ─── 5. TABLE 2: REVIEWS CRUD TESTS ───
  console.log('\n▶ TEST SUITE 5: Table 2 (reviews) Server-Side CRUD');
  let testReviewId = null;
  {
    // GET
    const getRes = await fetch(`${BASE_URL}/api/admin/reviews`, {
      headers: { Cookie: sessionCookie },
    });
    assert(getRes.status === 200, 'GET /api/admin/reviews returns HTTP 200');
    const getJson = await getRes.json();
    assert(Array.isArray(getJson.data), `Fetched ${getJson.data?.length} existing reviews`);

    // POST
    const postRes = await fetch(`${BASE_URL}/api/admin/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        customerName: 'Automated QA Reviewer',
        customerImage: '/images/baker-where/prod_pancakes.jpg',
        review: 'Super moist and perfectly balanced sweetness! 5 stars!',
        rating: 5,
        verified: true,
      }),
    });
    assert(postRes.status === 200, 'POST /api/admin/reviews creates review (HTTP 200)');
    const postJson = await postRes.json();
    testReviewId = postJson.data?.id;
    assert(Boolean(testReviewId), `Created test review ID: ${testReviewId}`);

    // PATCH
    const patchRes = await fetch(`${BASE_URL}/api/admin/reviews`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        id: testReviewId,
        updates: {
          customerName: 'Automated QA Reviewer UPDATED',
          rating: 4,
        },
      }),
    });
    assert(patchRes.status === 200, 'PATCH /api/admin/reviews updates review (HTTP 200)');
    const patchJson = await patchRes.json();
    assert(patchJson.data?.customer_name === 'Automated QA Reviewer UPDATED', 'Updated review name verified');

    // DELETE
    const delRes = await fetch(`${BASE_URL}/api/admin/reviews`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ id: testReviewId }),
    });
    assert(delRes.status === 200, 'DELETE /api/admin/reviews deletes review (HTTP 200)');

    // Verify deletion
    const verifyDel = await fetch(`${BASE_URL}/api/admin/reviews?id=${testReviewId}`, {
      headers: { Cookie: sessionCookie },
    });
    const verifyJson = await verifyDel.json();
    assert(!verifyJson.data, 'Review record confirmed deleted from Supabase');
  }

  // ─── 6. TABLE 3: SITE_HERO CRUD TESTS ───
  console.log('\n▶ TEST SUITE 6: Table 3 (site_hero) Server-Side Management');
  {
    // GET
    const getRes = await fetch(`${BASE_URL}/api/admin/hero`, {
      headers: { Cookie: sessionCookie },
    });
    assert(getRes.status === 200, 'GET /api/admin/hero returns HTTP 200');
    const getJson = await getRes.json();
    const originalHero = getJson.data;
    assert(Boolean(originalHero?.id), `Found hero singleton ID: ${originalHero?.id}`);

    // PATCH
    const patchRes = await fetch(`${BASE_URL}/api/admin/hero`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        captionTitle: "today's batch ♡ [QA Test]",
      }),
    });
    assert(patchRes.status === 200, 'PATCH /api/admin/hero updates caption (HTTP 200)');

    // RESTORE ORIGINAL
    const restoreRes = await fetch(`${BASE_URL}/api/admin/hero`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        captionTitle: originalHero.caption_title,
      }),
    });
    assert(restoreRes.status === 200, 'PATCH /api/admin/hero restored original caption cleanly');
  }

  // ─── 7. TABLE 4: SITE_STORY CRUD TESTS ───
  console.log('\n▶ TEST SUITE 7: Table 4 (site_story) Server-Side Management');
  {
    // GET
    const getRes = await fetch(`${BASE_URL}/api/admin/story`, {
      headers: { Cookie: sessionCookie },
    });
    assert(getRes.status === 200, 'GET /api/admin/story returns HTTP 200');
    const getJson = await getRes.json();
    const originalStory = getJson.data;
    assert(Boolean(originalStory?.id), `Found story singleton ID: ${originalStory?.id}`);

    // PATCH
    const patchRes = await fetch(`${BASE_URL}/api/admin/story`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        tagline: 'our story & secrets [QA Test]',
      }),
    });
    assert(patchRes.status === 200, 'PATCH /api/admin/story updates tagline (HTTP 200)');

    // RESTORE ORIGINAL
    const restoreRes = await fetch(`${BASE_URL}/api/admin/story`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        tagline: originalStory.tagline,
      }),
    });
    assert(restoreRes.status === 200, 'PATCH /api/admin/story restored original tagline cleanly');
  }

  // ─── 8. TABLE 5: SITE_INSTAGRAM CRUD TESTS ───
  console.log('\n▶ TEST SUITE 8: Table 5 (site_instagram) Server-Side CRUD');
  let testInstagramId = null;
  {
    // GET
    const getRes = await fetch(`${BASE_URL}/api/admin/instagram`, {
      headers: { Cookie: sessionCookie },
    });
    assert(getRes.status === 200, 'GET /api/admin/instagram returns HTTP 200');
    const getJson = await getRes.json();
    assert(Boolean(getJson.banner), 'Primary banner is present in response');
    assert(getJson.banner?.id === '00000000-0000-0000-0000-000000000003', 'Banner ID is 00000000-0000-0000-0000-000000000003');

    // POST: Create a new gallery entry
    const postRes = await fetch(`${BASE_URL}/api/admin/instagram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        image: '/images/baker-where/instagram_cta_dessert.jpg',
        alt: 'Automated QA Gallery Post',
        description: 'Fresh batch of golden cookies just dropped! 🍪',
        instagram_handle: '@plottwist24x',
        instagram_url: 'https://www.instagram.com/plottwist24x7',
        display_order: 10,
        is_active: true,
      }),
    });
    assert(postRes.status === 200, 'POST /api/admin/instagram creates new entry (HTTP 200)');
    const postJson = await postRes.json();
    testInstagramId = postJson.data?.id;
    assert(Boolean(testInstagramId) && testInstagramId !== '00000000-0000-0000-0000-000000000003', `Created unique entry ID: ${testInstagramId}`);

    // PATCH: Update the gallery entry
    const patchRes = await fetch(`${BASE_URL}/api/admin/instagram`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        id: testInstagramId,
        alt: 'Automated QA Gallery Post UPDATED',
        description: 'Updated caption with extra chocolate goodness! 🍫',
      }),
    });
    assert(patchRes.status === 200, 'PATCH /api/admin/instagram updates entry (HTTP 200)');
    const patchJson = await patchRes.json();
    assert(patchJson.data?.alt_text === 'Automated QA Gallery Post UPDATED', 'Updated entry alt_text verified');

    // DELETE PROTECTION: Ensure singleton banner CANNOT be deleted
    const badDelRes = await fetch(`${BASE_URL}/api/admin/instagram?id=00000000-0000-0000-0000-000000000003`, {
      method: 'DELETE',
      headers: {
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
    });
    assert(badDelRes.status === 400, 'DELETE on singleton banner is strictly rejected with HTTP 400');

    // DELETE: Delete the test gallery entry
    const delRes = await fetch(`${BASE_URL}/api/admin/instagram?id=${testInstagramId}`, {
      method: 'DELETE',
      headers: {
        Cookie: sessionCookie,
        Origin: 'http://localhost:3000',
      },
    });
    assert(delRes.status === 200, 'DELETE /api/admin/instagram deletes entry (HTTP 200)');

    // Verify deletion
    const verifyDel = await fetch(`${BASE_URL}/api/admin/instagram?id=${testInstagramId}`, {
      headers: { Cookie: sessionCookie },
    });
    const verifyJson = await verifyDel.json();
    assert(!verifyJson.data, 'Instagram entry confirmed deleted from Supabase');
  }

  // ─── 9. STOREFRONT INTEGRITY & FOUR FEATURED FAVES ───
  console.log('\n▶ TEST SUITE 9: Storefront Integrity & Four Featured Faves');
  {
    const storeRes = await fetch(`${BASE_URL}/`);
    assert(storeRes.status === 200, 'Homepage returns HTTP 200');
    const storeHtml = await storeRes.text();

    const expectedFaves = [
      'Double Chocolate Muffins',
      'Chocolate Chip Cookies',
      'Mocha Oreo Fudge',
      'Venetian Tiramisu',
    ];

    for (const f of expectedFaves) {
      assert(storeHtml.includes(f), `Storefront includes bestseller: "${f}"`);
    }

    assert(storeHtml.includes('instagram-cta'), 'Storefront includes Instagram CTA section');
    assert(storeHtml.includes('@plottwist24x'), 'Storefront includes Instagram handle');
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('═══════════════════════════════════════════════════════════════');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

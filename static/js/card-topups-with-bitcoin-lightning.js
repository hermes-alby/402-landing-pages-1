(function () {
  'use strict';

  // ---- Nav scroll state ----
  var nav = document.querySelector('.topup-nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- FAQ accordion ----
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item, idx) {
    if (idx === 0) item.classList.add('open');
    var btn = item.querySelector('button');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---- Hero demo ----
  var demo = document.querySelector('.demo');
  if (!demo) return;

  var cardData = {
    '2fiat':  { name: '2fiat',  last: '4421', tag: 'PLATINUM', color: 'linear-gradient(135deg, #2A2820 0%, #0d0d0a 100%)' },
    'bitsa':  { name: 'Bitsa',  last: '8810', tag: 'METAL',    color: 'linear-gradient(135deg, #1d4d8c 0%, #0a2546 100%)' },
    'crypto': { name: 'Spend.', last: '1199', tag: 'PRO',      color: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)' },
  };
  var state = { step: 0, amount: 50, card: '2fiat', interacted: false };

  var $card = demo.querySelector('.demo-card');
  var $tag  = demo.querySelector('.demo-card .tag');
  var $num  = demo.querySelector('.demo-card .num');
  var $name = demo.querySelector('.demo-card .row .name');
  var $stepsBars = demo.querySelectorAll('.steps span');
  var $panes = demo.querySelectorAll('.demo-pane');
  var $cardBtns = demo.querySelectorAll('.card-pick button');
  var $amountInput = demo.querySelector('.amount-input input');
  var $presets = demo.querySelectorAll('.preset-row button');
  var $sats = demo.querySelector('.summary .sats-v');
  var $invoiceAmt = demo.querySelector('.pane-invoice .big');
  var $invoiceCard = demo.querySelector('.pane-invoice .lead strong');
  var $invoiceStr = demo.querySelector('.invoice .lnstr');
  var $successAmt = demo.querySelector('.pane-success .t2');
  var $generate = demo.querySelector('.btn-generate');
  var $pay = demo.querySelector('.btn-pay');

  function render() {
    var c = cardData[state.card];
    if ($card) {
      $card.style.background = c.color;
      $card.classList.toggle('success', state.step === 3);
    }
    if ($tag) $tag.textContent = c.tag;
    if ($num) $num.textContent = '•••• •••• •••• ' + c.last;
    if ($name) $name.textContent = c.name;

    $stepsBars.forEach(function (el, i) {
      el.classList.toggle('on', i <= state.step);
    });
    $panes.forEach(function (p, i) {
      p.classList.toggle('active', i === state.step);
    });
    $cardBtns.forEach(function (b) {
      b.classList.toggle('on', b.dataset.card === state.card);
    });
    $presets.forEach(function (b) {
      b.classList.toggle('on', +b.dataset.amt === state.amount);
    });
    var sats = Math.round(state.amount * 920);
    if ($sats) $sats.textContent = sats.toLocaleString() + ' sats';
    if ($invoiceAmt) $invoiceAmt.textContent = '€' + state.amount;
    if ($invoiceCard) $invoiceCard.textContent = c.name;
    if ($invoiceStr) $invoiceStr.textContent = 'lnbc' + sats + 'n1pj9k...4p2gn5';
    if ($successAmt) $successAmt.textContent = '€' + state.amount + ' available on •••• ' + c.last;
  }

  function setStep(s) { state.step = s; render(); }
  function touch() { state.interacted = true; }

  $cardBtns.forEach(function (b) {
    b.addEventListener('click', function () { touch(); state.card = b.dataset.card; render(); });
  });
  $presets.forEach(function (b) {
    b.addEventListener('click', function () {
      touch();
      state.amount = +b.dataset.amt;
      if ($amountInput) $amountInput.value = state.amount;
      render();
    });
  });
  if ($amountInput) {
    $amountInput.addEventListener('input', function (e) {
      touch();
      state.amount = Math.max(1, +e.target.value || 0);
      render();
    });
  }
  if ($generate) $generate.addEventListener('click', function () { touch(); setStep(1); });
  if ($pay) $pay.addEventListener('click', function () { touch(); setStep(2); setTimeout(function () { setStep(3); }, 1800); });

  // auto-cycle if untouched
  function cycle() {
    if (state.interacted) return;
    var t = [];
    t.push(setTimeout(function () { if (!state.interacted) setStep(1); }, 2200));
    t.push(setTimeout(function () { if (!state.interacted) setStep(2); }, 4800));
    t.push(setTimeout(function () { if (!state.interacted) setStep(3); }, 6800));
    t.push(setTimeout(function () {
      if (!state.interacted) { setStep(0); cycle(); }
    }, 10000));
  }
  render();
  cycle();
})();

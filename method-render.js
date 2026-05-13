// ============================================================
// method-render.js — renderiza metodo.html e niveis.html
// Lê de window.METHOD_DATA (method-data.js)
// ============================================================

(() => {
  'use strict';

  const D = window.METHOD_DATA;
  if (!D) { console.error('[method] method-data.js não carregado'); return; }

  const $  = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => root.querySelectorAll(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  // ---------- NAVEGAÇÃO DA SIDEBAR ----------
  function setupNav() {
    $$('.menu-item[data-href]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => { window.location.href = el.dataset.href; });
    });

    const hamburger = document.getElementById('hamburger');
    const sidebar   = document.getElementById('sidebar');
    const backdrop  = document.getElementById('sidebar-backdrop');
    if (hamburger && sidebar && backdrop) {
      const toggle = () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('show');
      };
      hamburger.addEventListener('click', toggle);
      backdrop.addEventListener('click', toggle);
    }
  }

  // ============================================================
  // PÁGINA: metodo.html
  // ============================================================
  function renderMetodoPage() {
    const root = $('#method-root');
    if (!root) return;

    const o = D.overview;

    root.innerHTML = `
      <!-- HERO -->
      <div class="method-hero">
        <div class="method-hero-inner">
          <div class="method-hero-tag">Sistema CEFR para Fluência Real</div>
          <h1 class="method-hero-title">${esc(o.title)}</h1>
          <p class="method-hero-sub">${esc(o.subtitle)}</p>
          <div class="method-hero-formula">
            <span class="formula-text">${esc(o.formula)}</span>
          </div>
        </div>
      </div>

      <!-- LINHA 1: FILOSOFIA + ESTRUTURA IDEAL -->
      <div class="method-grid-2">
        <div class="panel panel-accent panel-pink">
          <div class="panel-title"><span>🌸</span> Filosofia</div>
          <p class="panel-text">${esc(o.philosophy)}</p>
        </div>

        <div class="panel panel-accent panel-teal">
          <div class="panel-title"><span>📊</span> Estrutura Ideal</div>
          <div class="structure-stats">
            ${o.idealStructure.map(s => `
              <div class="struct-item struct-${s.color}">
                <div class="struct-value">${s.value}%</div>
                <div class="struct-label">${esc(s.label)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- LINHA 2: REGRA DE OURO + FÓRMULA -->
      <div class="method-grid-2">
        <div class="panel panel-accent panel-green">
          <div class="panel-title"><span>🎯</span> Regra de Ouro</div>
          <div class="golden-rule">
            <div class="golden-side">
              <div class="golden-value">${o.goldenRule.student}%</div>
              <div class="golden-label">Aluno falando</div>
            </div>
            <div class="golden-divider">/</div>
            <div class="golden-side">
              <div class="golden-value golden-muted">${o.goldenRule.teacher}%</div>
              <div class="golden-label">Professor guiando</div>
            </div>
          </div>
        </div>

        <div class="panel panel-accent panel-orange">
          <div class="panel-title"><span>⚡</span> Fórmula Central</div>
          <div class="formula-block">
            <span class="formula-equation">${esc(o.formula)}</span>
          </div>
        </div>
      </div>

      <!-- ESTRUTURA DE AULA -->
      <div class="panel">
        <div class="panel-title">Estrutura Perfeita de Aula — ${esc(D.lessonStructure.duration)}</div>
        <div class="lesson-table">
          <div class="lesson-table-head">
            <div>Etapa</div>
            <div>Tempo</div>
            <div>Objetivo</div>
          </div>
          ${D.lessonStructure.stages.map(s => `
            <div class="lesson-table-row">
              <div class="lesson-stage">
                <span class="lesson-stage-icon">${s.icon}</span>
                <span>${esc(s.name)}</span>
              </div>
              <div class="lesson-time">${esc(s.time)}</div>
              <div class="lesson-goal">${esc(s.goal)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- O QUE GERA RESULTADO -->
      <div class="panel panel-accent panel-green">
        <div class="panel-title"><span>✅</span> O Que Mais Gera Resultado</div>
        <div class="chip-list">
          ${o.results.map(r => `<span class="chip chip-green">✓ ${esc(r)}</span>`).join('')}
        </div>
      </div>

      <!-- NÍVEIS (cards clicáveis) -->
      <div class="panel">
        <div class="panel-title">Progressão CEFR — clique em um nível</div>
        <div class="levels-grid">
          ${Object.values(D.levels).map(lv => `
            <a class="level-card level-card-${lv.badgeClass}" href="niveis.html?cefr=${lv.code}">
              <div class="level-card-head">
                <span class="badge ${lv.badgeClass}">${lv.code}</span>
                <span class="level-card-name">${esc(lv.name)}</span>
              </div>
              <div class="level-card-label">${esc(lv.label)}</div>
              <div class="level-card-time">${esc(lv.averageTime)}</div>
              <div class="level-card-arrow">→</div>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- ENGLISH ROUTINE -->
      <div class="method-grid-2">
        <div class="panel">
          <div class="panel-title">English Routine <span>(semanal)</span></div>
          <div class="routine-list">
            ${D.englishRoutine.items.map(i => `
              <div class="routine-item">
                <span class="routine-icon">${i.icon}</span>
                <div>
                  <div class="routine-name">${esc(i.name)}</div>
                  <div class="routine-detail">${esc(i.detail)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">Shadowing</div>
          <div class="shadowing-steps">
            ${D.englishRoutine.shadowing.steps.map((s, i) => `
              <div class="shadow-step">
                <span class="shadow-num">${i + 1}</span>
                <span>${esc(s)}</span>
              </div>
            `).join('')}
          </div>
          <div class="shadowing-benefits">
            ${D.englishRoutine.shadowing.benefits.map(b => `<span class="chip chip-purple">✓ ${esc(b)}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- MICRO FLUÊNCIA -->
      <div class="panel panel-accent panel-purple">
        <div class="panel-title"><span>💎</span> Sistema de Micro Fluência</div>
        <p class="panel-text">${esc(D.microFluency.description)}</p>
        <div class="chip-list">
          ${D.microFluency.situations.map(s => `<span class="chip">${esc(s)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  // ============================================================
  // PÁGINA: niveis.html
  // ============================================================
  function renderLevelsPage() {
    const root = $('#level-root');
    const tabs = $('#level-tabs');
    if (!root || !tabs) return;

    const params = new URLSearchParams(window.location.search);
    const currentCode = (params.get('cefr') || 'A1').toUpperCase();
    const levelCodes = Object.keys(D.levels);

    // Tabs
    tabs.innerHTML = levelCodes.map(code => {
      const lv = D.levels[code];
      const active = code === currentCode ? 'active' : '';
      return `
        <a class="level-tab ${active}" href="niveis.html?cefr=${code}">
          <span class="badge ${lv.badgeClass}">${code}</span>
          <span class="level-tab-name">${esc(lv.name)}</span>
        </a>
      `;
    }).join('');

    const lv = D.levels[currentCode] || D.levels.A1;
    const qty = D.lessonStructure.quantitiesByLevel[lv.code] || {};

    root.innerHTML = `
      <!-- HEADER do nível -->
      <div class="level-header">
        <div class="level-header-left">
          <span class="badge ${lv.badgeClass} badge-lg">${lv.code}</span>
          <div>
            <h1 class="level-h1">${esc(lv.name)}</h1>
            <p class="level-h1-sub">${esc(lv.label)}</p>
          </div>
        </div>
        <div class="level-header-right">
          <div class="level-meta">
            <div class="level-meta-label">Tempo médio</div>
            <div class="level-meta-value">${esc(lv.averageTime)}</div>
          </div>
          <div class="level-meta">
            <div class="level-meta-label">Áudio (Listening)</div>
            <div class="level-meta-value">${esc(lv.audioDuration)}</div>
          </div>
        </div>
      </div>

      <!-- OBJETIVO -->
      <div class="panel">
        <div class="panel-title">🎯 Objetivo do ${lv.code}</div>
        <p class="panel-text panel-text-lg">${esc(lv.objective)}</p>
        <div class="panel-subtitle">O aluno aprende a:</div>
        <ul class="bullet-list">
          ${lv.learnsTo.map(it => `<li>${esc(it)}</li>`).join('')}
        </ul>
      </div>

      <!-- ESTRUTURA + GRAMÁTICA -->
      <div class="method-grid-2">
        <div class="panel">
          <div class="panel-title">📊 Estrutura Ideal</div>
          <div class="structure-stats">
            ${lv.structure.map((s, i) => {
              const colors = ['purple', 'teal', 'blue', 'orange'];
              return `
                <div class="struct-item struct-${colors[i] || 'purple'}">
                  <div class="struct-value">${s.value}%</div>
                  <div class="struct-label">${esc(s.label)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">🧩 Gramática Principal</div>
          <div class="chip-list">
            ${lv.grammar.map(g => `<span class="chip">${esc(g)}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- TEMAS MENSAIS -->
      <div class="panel">
        <div class="panel-title">📅 Temas Mensais</div>
        <div class="themes-grid">
          ${lv.themes.map(t => `
            <div class="theme-month">
              <div class="theme-month-num">${String(t.month).padStart(2, '0')}</div>
              <div class="theme-month-name">${esc(t.name)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- O QUE FUNCIONA + MISSÕES -->
      <div class="method-grid-2">
        <div class="panel panel-accent panel-green">
          <div class="panel-title">✅ O Que Mais Funciona</div>
          <div class="chip-list">
            ${lv.whatWorks.map(w => `<span class="chip chip-green">${esc(w)}</span>`).join('')}
          </div>
        </div>

        <div class="panel panel-accent panel-orange">
          <div class="panel-title">🏆 Missões Semanais</div>
          <ul class="bullet-list">
            ${lv.missions.map(m => `<li>${esc(m)}</li>`).join('')}
          </ul>
          <div class="panel-subtitle" style="margin-top:14px">Core Expressions:</div>
          <div class="chip-list">
            ${lv.coreExpressions.map(e => `<span class="chip chip-orange">"${esc(e)}"</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- QUANTIDADES NA AULA -->
      <div class="panel">
        <div class="panel-title">⏱️ Quantidades Ideais por Etapa (${lv.code})</div>
        <div class="qty-grid">
          <div class="qty-item">
            <div class="qty-label">New Vocabulary</div>
            <div class="qty-value">${esc(qty.vocab || '—')}</div>
          </div>
          <div class="qty-item">
            <div class="qty-label">Listening (áudio)</div>
            <div class="qty-value">${esc(qty.audio || '—')}</div>
          </div>
          <div class="qty-item">
            <div class="qty-label">Perguntas no Listening</div>
            <div class="qty-value">${esc(qty.listeningQs || '—')}</div>
          </div>
          <div class="qty-item">
            <div class="qty-label">Speaking Activity</div>
            <div class="qty-value">${esc(qty.speaking || '—')}</div>
          </div>
        </div>
      </div>

      ${lv.monthlyLessons ? `
        <!-- ESTRUTURA MENSAL DETALHADA (só B1 tem por enquanto) -->
        <div class="panel">
          <div class="panel-title">📖 Estrutura Mensal Detalhada — Exemplo</div>
          <div class="lessons-detail">
            ${lv.monthlyLessons.map(al => `
              <div class="lesson-detail">
                <div class="lesson-detail-title">${esc(al.title)}</div>
                <div class="lesson-detail-grid">
                  <div>
                    <div class="ld-label">💬 Comunicação</div>
                    <ul class="bullet-list bullet-sm">
                      ${al.communication.map(c => `<li>${esc(c)}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <div class="ld-label">🎧 Listening</div>
                    <ul class="bullet-list bullet-sm">
                      ${al.listening.map(c => `<li>${esc(c)}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <div class="ld-label">📖 Reading</div>
                    <p class="ld-text">${esc(al.reading)}</p>
                  </div>
                  <div>
                    <div class="ld-label">🧩 Grammar</div>
                    <p class="ld-text">${esc(al.grammar)}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- VOLTAR -->
      <div class="back-link-wrap">
        <a href="metodo.html" class="back-link">← Voltar ao Método</a>
      </div>
    `;
  }

  // ---------- BOOT ----------
  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    renderMetodoPage();
    renderLevelsPage();
  });
})();

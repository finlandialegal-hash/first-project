/**
 * ========================================================
 * APLICAÇÃO PRINCIPAL: HUD & MENUS ESTILO ROBLOX
 * Para Ultimate UI (Minecraft) e Visualização Web
 * Sem logos, títulos ou marcas registradas protegidas
 * ========================================================
 */

class RobloxStyleApp {
  constructor() {
    this.soundEnabled = true;
    this.audioCtx = null;
    this.health = 100;
    this.maxHealth = 100;
    this.activeSlot = 0;
    this.activeEscTab = 'tab-home';
    this.activeAvatarSubtab = 'sub-skin';
    this.currentChatChannel = 'all';

    // Estado do Avatar
    this.avatarState = {
      skinColor: '#E5A00D', // Amarelo clássico
      torsoColor: '#0D69AC', // Azul clássico
      legColor: '#27462D',   // Verde clássico
      hat: 'hair_classic',
      shirt: 'shirt_casual',
      accessory: 'none',
      rotation: 0,
      isDragging: false,
      lastMouseX: 0,
      activeEmote: null,
      emoteFrame: 0
    };

    // Hotbar Itens
    this.hotbarItems = [
      { id: 1, name: 'Espada Lendária', icon: '⚔️' },
      { id: 2, name: 'Picareta de Diamante', icon: '⛏️' },
      { id: 3, name: 'Arco Encantado', icon: '🏹' },
      { id: 4, name: 'Maçã Dourada', icon: '🍏' },
      { id: 5, name: 'Poção de Agilidade', icon: '🧪' },
      { id: 6, name: 'Bloco de Ouro', icon: '🧱' },
      { id: 7, name: 'Gancho Retrátil', icon: '🪝' },
      { id: 8, name: 'Bússola Mágica', icon: '🧭' },
      { id: 9, name: 'Livro de Emotes', icon: '📖' }
    ];

    // Jogadores Online Simulados
    this.players = [
      { name: 'Steve_Gamer', rank: 'admin', ping: 18, level: 99 },
      { name: 'Alex_Master', rank: 'vip', ping: 24, level: 65 },
      { name: 'Jogador (Você)', rank: 'member', ping: 22, level: 28, isSelf: true },
      { name: 'Notch_Fan', rank: 'vip', ping: 35, level: 42 },
      { name: 'BlockBuilder99', rank: 'member', ping: 48, level: 19 },
      { name: 'PixelHero', rank: 'member', ping: 62, level: 31 },
      { name: 'DiamondKnight', rank: 'vip', ping: 29, level: 53 },
      { name: 'ShadowMiner', rank: 'member', ping: 75, level: 12 }
    ];

    // Códigos YAML para o Exporter do Ultimate UI (com defaults embutidos caso fetch seja restrito)
    this.yamlConfigs = {
      'hud.yml': `# Ultimate UI - HUD estilo Roblox
id: "roblox_hud"
title: ""
type: "hud"
enabled: true
priority: 10
layout:
  screen-anchor: "top-left"
  scale-mode: "adaptive"
elements:
  topbar_pill:
    type: "panel"
    x: 12
    y: 12
    width: 240
    height: 44
    border-radius: 12
    background-color: "#191B1F"
    opacity: 0.88
  btn_menu:
    type: "button"
    x: 18
    y: 18
    width: 32
    height: 32
    icon: "textures/ui/icons/menu.png"
    actions:
      click: ["ultimateui open escape_menu"]
  btn_chat:
    type: "button"
    x: 58
    y: 18
    width: 32
    height: 32
    actions:
      click: ["ultimateui toggle_hud chat_overlay"]
  btn_avatar:
    type: "button"
    x: 138
    y: 18
    width: 32
    height: 32
    actions:
      click: ["ultimateui open avatar_menu"]
  health_bar_fill:
    type: "progress_bar"
    x: "calc(100% - 310)"
    y: 20
    width: 130
    height: 12
    fill_color: "#00E676"
    placeholder_current: "%player_health%"
    placeholder_max: "%player_max_health%"`,

      'escape_menu.yml': `# Ultimate UI - Menu ESC estilo Roblox
id: "escape_menu"
title: ""
type: "cursor_menu"
cursor: true
blur_background: true
layout:
  width: 780
  height: 520
  align: "center"
tabs:
  - id: "tab_home"
    name: "Início"
  - id: "tab_players"
    name: "Jogadores"
  - id: "tab_avatar"
    name: "Avatar"
  - id: "tab_settings"
    name: "Configurações"
  - id: "tab_help"
    name: "Ajuda"`,

      'avatar_menu.yml': `# Ultimate UI - Menu de Avatar estilo Roblox
id: "avatar_menu"
title: ""
type: "cursor_menu"
cursor: true
blur_background: true
layout:
  width: 860
  height: 560
  align: "center"
elements:
  preview_panel:
    type: "character_view_3d"
    x: 24
    y: 72
    width: 320
    height: 410
  skin_palette_grid:
    type: "color_picker_grid"
    columns: 6
    colors: ["#E5A00D", "#E8B88A", "#D29C6E", "#A56A44", "#0D69AC", "#C4281C", "#27462D", "#6B327C"]`,

      'home_menu.yml': `# Ultimate UI - Hub de Modos de Início
id: "home_menu"
title: ""
type: "cursor_menu"
cursor: true
layout:
  width: 900
  height: 580
  align: "center"
hero_card:
  title: "Modo em Destaque: Sobrevivência RPG"
  action: "server connect survival_rpg"`
    };

    this.init();
  }

  async init() {
    this.initAudio();
    this.initWorldCanvas();
    this.renderHotbar();
    this.renderLeaderboard();
    this.renderFullPlayersTable();
    this.initAvatarEditor();
    this.bindEvents();
    this.loadYamlConfigs();
    this.startEmoteAnimationLoop();
  }

  /* ========================================================
     SISTEMA DE ÁUDIO WEB SYNTH (CLIQUES E EFEITOS)
     ======================================================== */
  initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }
  }

  playSound(type = 'click') {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.07);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'equip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'damage') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'heal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, now);
      osc.frequency.setValueAtTime(523.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  }

  /* ========================================================
     CENÁRIO 3D / GAME CANVAS (MINECRAFT PSEUDO-3D)
     ======================================================== */
  initWorldCanvas() {
    const canvas = document.getElementById('world-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let mouseX = width / 2;
    let mouseY = height / 2;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Blocos de terreno em perspectiva voxel
    const blocks = [];
    const gridSize = 16;
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = 1; z <= gridSize * 1.5; z++) {
        const heightNoise = Math.sin(x * 0.4) * Math.cos(z * 0.3) * 1.5;
        blocks.push({
          x: x * 40,
          y: 120 + heightNoise * 30,
          z: z * 40,
          type: (x + z) % 5 === 0 ? 'stone' : (x + z) % 3 === 0 ? 'darkgrass' : 'grass'
        });
      }
    }

    // Nuvens estilizadas
    const clouds = [
      { x: -200, y: -220, z: 400, w: 220, h: 50 },
      { x: 150, y: -260, z: 600, w: 320, h: 60 },
      { x: -350, y: -180, z: 500, w: 180, h: 45 },
      { x: 300, y: -200, z: 450, w: 240, h: 55 }
    ];

    let time = 0;
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Gradiente de Céu (Crepúsculo / Noite suave estilo Minecraft)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0c1b33');
      skyGrad.addColorStop(0.6, '#1a365d');
      skyGrad.addColorStop(1, '#2d4a68');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sol Quadrado estilo Minecraft
      const sunX = width * 0.7 + Math.sin(time * 0.2) * 40;
      const sunY = height * 0.25;
      ctx.fillStyle = '#FFE082';
      ctx.fillRect(sunX - 28, sunY - 28, 56, 56);
      ctx.fillStyle = 'rgba(255, 224, 130, 0.15)';
      ctx.fillRect(sunX - 42, sunY - 42, 84, 84);

      // Nuvens quadradas flutuando
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      clouds.forEach(c => {
        c.x += 0.25;
        if (c.x > width + 200) c.x = -400;
        const camOffset = (mouseX - width / 2) * 0.04;
        ctx.fillRect(c.x + camOffset, height * 0.3 + c.y * 0.4, c.w, c.h);
      });

      // Renderizar Terreno
      const camX = (mouseX - width / 2) * 0.3;
      const camY = (mouseY - height / 2) * 0.2;
      const horizon = height * 0.58;

      blocks.forEach(b => {
        const perspective = 500 / (b.z + 500);
        const screenX = (width / 2) + (b.x - camX) * perspective;
        const screenY = horizon + (b.y - camY) * perspective;
        const size = 38 * perspective;

        if (size > 1 && screenX > -50 && screenX < width + 50) {
          // Topo do bloco
          if (b.type === 'grass') {
            ctx.fillStyle = '#4CAF50';
          } else if (b.type === 'darkgrass') {
            ctx.fillStyle = '#388E3C';
          } else {
            ctx.fillStyle = '#78909C';
          }
          ctx.fillRect(screenX, screenY, size, size * 0.7);

          // Lado de terra
          ctx.fillStyle = b.type === 'stone' ? '#546E7A' : '#5D4037';
          ctx.fillRect(screenX, screenY + size * 0.7, size, size * 0.6);

          // Contorno de pixel
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(screenX, screenY, size, size * 1.3);
        }
      });

      requestAnimationFrame(render);
    };

    render();
  }

  /* ========================================================
     SISTEMA DE VIDA (HEALTH BAR)
     ======================================================== */
  setHealth(newHealth) {
    this.health = Math.max(0, Math.min(this.maxHealth, newHealth));
    const fill = document.getElementById('health-fill');
    const label = document.getElementById('health-label');

    if (!fill || !label) return;

    const percent = (this.health / this.maxHealth) * 100;
    fill.style.width = `${percent}%`;
    label.innerText = `${this.health} / ${this.maxHealth}`;

    // Classes de cor dinâmicas
    fill.classList.remove('warning', 'danger');
    if (percent <= 25) {
      fill.classList.add('danger');
    } else if (percent <= 55) {
      fill.classList.add('warning');
    }

    if (this.health === 0) {
      this.playSound('damage');
      this.showToast('Você foi eliminado! Renascendo...');
      setTimeout(() => {
        this.setHealth(100);
        this.playSound('heal');
      }, 1500);
    }
  }

  /* ========================================================
     RENDERIZADOR DA HOTBAR (1-9 SLOTS)
     ======================================================== */
  renderHotbar() {
    const container = document.getElementById('hotbar-slots');
    if (!container) return;

    container.innerHTML = '';
    this.hotbarItems.forEach((item, index) => {
      const slot = document.createElement('div');
      slot.className = `slot ${index === this.activeSlot ? 'active' : ''}`;
      slot.dataset.index = index;

      slot.innerHTML = `
        <span class="slot-key">${index + 1}</span>
        <span class="slot-icon">${item.icon}</span>
      `;

      slot.addEventListener('click', () => {
        this.selectSlot(index);
      });

      container.appendChild(slot);
    });

    this.updateItemTooltip();
  }

  selectSlot(index) {
    if (index < 0 || index >= this.hotbarItems.length) return;
    this.activeSlot = index;

    const slots = document.querySelectorAll('.hotbar-slots .slot');
    slots.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });

    this.playSound('pop');
    this.updateItemTooltip();
    this.drawAvatarPreview();
  }

  updateItemTooltip() {
    const tooltip = document.getElementById('item-tooltip');
    if (!tooltip) return;

    const item = this.hotbarItems[this.activeSlot];
    tooltip.innerText = `[${this.activeSlot + 1}] ${item.name}`;
    tooltip.classList.add('visible');

    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      tooltip.classList.remove('visible');
    }, 2000);
  }

  /* ========================================================
     LEADERBOARD & TABELAS DE JOGADORES
     ======================================================== */
  renderLeaderboard() {
    const container = document.getElementById('leaderboard-rows');
    if (!container) return;

    container.innerHTML = '';
    this.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'leader-row';
      row.innerHTML = `
        <div class="leader-user">
          <span>${p.name}</span>
        </div>
        <div><span class="rank-badge ${p.rank}">${p.rank.toUpperCase()}</span></div>
        <div class="ping-val">${p.ping}ms</div>
        <div>
          ${p.isSelf ? '<span style="font-size:10px; color:#9DA3AE;">Você</span>' : '<button class="btn-mini-action" onclick="app.showToast(\'Convite enviado para ' + p.name + '!\')">Convidar</button>'}
        </div>
      `;
      container.appendChild(row);
    });
  }

  renderFullPlayersTable() {
    const container = document.getElementById('full-players-list');
    if (!container) return;

    container.innerHTML = '';
    this.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'p-table-row';
      row.innerHTML = `
        <div class="user-cell">
          <div class="mini-avatar" style="background:#E5A00D;"></div>
          <span>${p.name} (Nível ${p.level})</span>
        </div>
        <div><span class="rank-badge ${p.rank}">${p.rank.toUpperCase()}</span></div>
        <div class="ping-val">${p.ping} ms</div>
        <div class="table-actions">
          ${p.isSelf ? '<span style="color:#9DA3AE; font-size:11px;">Seu Personagem</span>' : `
            <button class="btn-table-action" onclick="app.showToast('Pedido de amizade enviado!')">Adicionar</button>
            <button class="btn-table-action" onclick="app.showToast('Jogador silenciado!')">Silenciar</button>
          `}
        </div>
      `;
      container.appendChild(row);
    });
  }

  /* ========================================================
     CHAT DO JOGO (INTERATIVO COM RESPOSTAS AUTOMÁTICAS)
     ======================================================== */
  sendChatMessage(text) {
    if (!text || !text.trim()) return;
    const list = document.getElementById('chat-messages-list');
    if (!list) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg';
    userMsg.innerHTML = `
      <span class="msg-sender user">[Jogador]:</span>
      <span class="msg-content">${this.escapeHtml(text.trim())}</span>
    `;
    list.appendChild(userMsg);
    list.scrollTop = list.scrollHeight;

    this.playSound('pop');

    // Resposta simulada de bot/servidor após 1.2s
    setTimeout(() => {
      const randomReplies = [
        'Boa jogada!',
        'Alguém viu a espada lendária?',
        'O menu do Ultimate UI ficou muito suave!',
        'Partiu minigame?',
        'Pressione ESC para ver as configurações.'
      ];
      const bot = this.players[Math.floor(Math.random() * (this.players.length - 1))];
      const replyText = randomReplies[Math.floor(Math.random() * randomReplies.length)];

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg';
      botMsg.innerHTML = `
        <span class="msg-sender ${bot.rank}">[${bot.rank.toUpperCase()}] ${bot.name}:</span>
        <span class="msg-content">${replyText}</span>
      `;
      list.appendChild(botMsg);
      list.scrollTop = list.scrollHeight;
      this.playSound('click');
    }, 1200);
  }

  escapeHtml(string) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(string).replace(/[&<>"']/g, s => entityMap[s]);
  }

  /* ========================================================
     PERSONALIZADOR DE AVATAR (RENDER BLOCKY 2.5D INTERATIVO)
     ======================================================== */
  initAvatarEditor() {
    const canvas = document.getElementById('avatar-preview-canvas');
    if (!canvas) return;

    // Gerar Paleta de Cores estilo Roblox
    const skinGrid = document.getElementById('skin-colors-grid');
    const colors = [
      '#E5A00D', // Classic Yellow
      '#E8B88A', // Tan
      '#D29C6E', // Medium Tan
      '#A56A44', // Brown
      '#5C3A21', // Dark Brown
      '#0D69AC', // Bright Blue
      '#C4281C', // Bright Red
      '#27462D', // Earth Green
      '#6B327C', // Purple
      '#F2F3F3', // White
      '#635F62', // Medium Stone
      '#1B2A35'  // Black
    ];

    if (skinGrid) {
      skinGrid.innerHTML = '';
      colors.forEach(col => {
        const swatch = document.createElement('div');
        swatch.className = `color-swatch ${col === this.avatarState.skinColor ? 'active' : ''}`;
        swatch.style.backgroundColor = col;
        swatch.dataset.color = col;

        swatch.addEventListener('click', () => {
          document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          this.avatarState.skinColor = col;
          this.playSound('equip');
          this.drawAvatarPreview();
          this.updateMiniAvatarColor();
        });

        skinGrid.appendChild(swatch);
      });
    }

    // Gerar Itens de Roupas
    const clothesGrid = document.getElementById('clothes-grid');
    const clothesItems = [
      { id: 'shirt_casual', name: 'Casual Azul', icon: '👕', torso: '#0D69AC', legs: '#1B2A35' },
      { id: 'shirt_suit', name: 'Terno Elegante', icon: '👔', torso: '#1B2A35', legs: '#1B2A35' },
      { id: 'shirt_hoodie', name: 'Moletom Vermelho', icon: '🧥', torso: '#C4281C', legs: '#23272F' },
      { id: 'shirt_armor', name: 'Armadura Diamante', icon: '🛡️', torso: '#4DD0E1', legs: '#00ACC1' },
      { id: 'shirt_ninja', name: 'Manto Ninja', icon: '🥷', torso: '#212121', legs: '#212121' },
      { id: 'shirt_gold', name: 'Armadura Dourada', icon: '✨', torso: '#FFD700', legs: '#FFA000' }
    ];

    if (clothesGrid) {
      clothesGrid.innerHTML = '';
      clothesItems.forEach(item => {
        const card = document.createElement('div');
        card.className = `item-card ${item.id === this.avatarState.shirt ? 'active' : ''}`;
        card.innerHTML = `
          <span class="item-equipped-tag">EQUIPADO</span>
          <span class="item-card-icon">${item.icon}</span>
          <span class="item-card-name">${item.name}</span>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('#clothes-grid .item-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.avatarState.shirt = item.id;
          this.avatarState.torsoColor = item.torso;
          this.avatarState.legColor = item.legs;
          this.playSound('equip');
          this.drawAvatarPreview();
        });
        clothesGrid.appendChild(card);
      });
    }

    // Gerar Itens de Chapéus
    const hatsGrid = document.getElementById('hats-grid');
    const hatsItems = [
      { id: 'none', name: 'Nenhum', icon: '❌' },
      { id: 'hair_classic', name: 'Cabelo Clássico', icon: '💇' },
      { id: 'hat_cap', name: 'Boné Vermelho', icon: '🧢' },
      { id: 'hat_crown', name: 'Coroa Dourada', icon: '👑' },
      { id: 'hat_helm', name: 'Elmo Guerreiro', icon: '⛑️' },
      { id: 'hat_wizard', name: 'Chapéu Mágico', icon: '🧙' }
    ];

    if (hatsGrid) {
      hatsGrid.innerHTML = '';
      hatsItems.forEach(item => {
        const card = document.createElement('div');
        card.className = `item-card ${item.id === this.avatarState.hat ? 'active' : ''}`;
        card.innerHTML = `
          <span class="item-equipped-tag">EQUIPADO</span>
          <span class="item-card-icon">${item.icon}</span>
          <span class="item-card-name">${item.name}</span>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('#hats-grid .item-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.avatarState.hat = item.id;
          this.playSound('equip');
          this.drawAvatarPreview();
        });
        hatsGrid.appendChild(card);
      });
    }

    // Gerar Itens de Acessórios
    const accGrid = document.getElementById('accessories-grid');
    const accItems = [
      { id: 'none', name: 'Nenhum', icon: '❌' },
      { id: 'acc_wings', name: 'Asas de Dragão', icon: '🪽' },
      { id: 'acc_sword', name: 'Espada nas Costas', icon: '🗡️' },
      { id: 'acc_backpack', name: 'Mochila Militar', icon: '🎒' },
      { id: 'acc_cape', name: 'Capa Épica', icon: '🧣' },
      { id: 'acc_shield', name: 'Escudo Protetor', icon: '🛡️' }
    ];

    if (accGrid) {
      accGrid.innerHTML = '';
      accItems.forEach(item => {
        const card = document.createElement('div');
        card.className = `item-card ${item.id === this.avatarState.accessory ? 'active' : ''}`;
        card.innerHTML = `
          <span class="item-equipped-tag">EQUIPADO</span>
          <span class="item-card-icon">${item.icon}</span>
          <span class="item-card-name">${item.name}</span>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('#accessories-grid .item-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.avatarState.accessory = item.id;
          this.playSound('equip');
          this.drawAvatarPreview();
        });
        accGrid.appendChild(card);
      });
    }

    // Gerar Emotes Interativos
    const emotesGrid = document.getElementById('emotes-grid');
    const emotes = [
      { id: 'wave', name: 'Acenar', desc: 'Acena amigavelmente', icon: '👋' },
      { id: 'dance', name: 'Dançar', desc: 'Passos de dança clássicos', icon: '🕺' },
      { id: 'clap', name: 'Aplaudir', desc: 'Bate palmas de comemoração', icon: '👏' },
      { id: 'sit', name: 'Sentar', desc: 'Descansa no chão', icon: '🪑' }
    ];

    if (emotesGrid) {
      emotesGrid.innerHTML = '';
      emotes.forEach(emote => {
        const card = document.createElement('div');
        card.className = 'emote-card';
        card.innerHTML = `
          <span class="emote-icon">${emote.icon}</span>
          <div class="emote-info">
            <span class="emote-title">${emote.name}</span>
            <span class="emote-desc">${emote.desc}</span>
          </div>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('.emote-card').forEach(c => c.classList.remove('playing'));
          card.classList.add('playing');
          this.playEmote(emote.id);
          this.playSound('pop');
        });
        emotesGrid.appendChild(card);
      });
    }

    // Interação com Mouse para girar o Avatar (Drag)
    canvas.addEventListener('mousedown', (e) => {
      this.avatarState.isDragging = true;
      this.avatarState.lastMouseX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.avatarState.isDragging) {
        const delta = e.clientX - this.avatarState.lastMouseX;
        this.avatarState.rotation += delta * 0.02;
        this.avatarState.lastMouseX = e.clientX;
        this.drawAvatarPreview();
      }
    });

    window.addEventListener('mouseup', () => {
      this.avatarState.isDragging = false;
    });

    // Botões de rotação
    document.getElementById('btn-rot-left')?.addEventListener('click', () => {
      this.avatarState.rotation -= Math.PI / 4;
      this.drawAvatarPreview();
    });
    document.getElementById('btn-rot-right')?.addEventListener('click', () => {
      this.avatarState.rotation += Math.PI / 4;
      this.drawAvatarPreview();
    });
    document.getElementById('btn-rot-reset')?.addEventListener('click', () => {
      this.avatarState.rotation = 0;
      this.drawAvatarPreview();
    });

    // Resetar e Salvar
    document.getElementById('btn-avatar-reset')?.addEventListener('click', () => {
      this.avatarState.skinColor = '#E5A00D';
      this.avatarState.torsoColor = '#0D69AC';
      this.avatarState.legColor = '#27462D';
      this.avatarState.hat = 'hair_classic';
      this.avatarState.shirt = 'shirt_casual';
      this.avatarState.accessory = 'none';
      this.avatarState.rotation = 0;
      this.playSound('equip');
      this.drawAvatarPreview();
      this.initAvatarEditor();
      this.showToast('Visual restaurado ao padrão!');
    });

    document.getElementById('btn-avatar-save')?.addEventListener('click', () => {
      this.playSound('equip');
      this.showToast('Avatar salvo no servidor com sucesso!');
    });

    this.drawAvatarPreview();
  }

  updateMiniAvatarColor() {
    const mini = document.getElementById('mini-avatar-face');
    if (mini) {
      mini.style.backgroundColor = this.avatarState.skinColor;
    }
  }

  playEmote(id) {
    this.avatarState.activeEmote = id;
    this.avatarState.emoteFrame = 0;

    clearTimeout(this.emoteTimeout);
    this.emoteTimeout = setTimeout(() => {
      this.avatarState.activeEmote = null;
      document.querySelectorAll('.emote-card').forEach(c => c.classList.remove('playing'));
      this.drawAvatarPreview();
    }, 4000);
  }

  startEmoteAnimationLoop() {
    const loop = () => {
      if (this.avatarState.activeEmote) {
        this.avatarState.emoteFrame += 0.12;
        this.drawAvatarPreview();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* RENDERIZADOR 2.5D DO AVATAR EM CANVAS */
  drawAvatarPreview() {
    const canvas = document.getElementById('avatar-preview-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Sombra suave sob os pés
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 35, 60, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    const rot = this.avatarState.rotation;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const centerX = width / 2;
    const centerY = height / 2 - 10;

    // Animações de Emotes
    let armLeftAngle = 0;
    let armRightAngle = 0;
    let bobY = 0;
    let legOffset = 0;

    if (this.avatarState.activeEmote === 'wave') {
      armRightAngle = -Math.PI / 1.3 + Math.sin(this.avatarState.emoteFrame * 4) * 0.3;
    } else if (this.avatarState.activeEmote === 'dance') {
      bobY = Math.sin(this.avatarState.emoteFrame * 3) * 8;
      armLeftAngle = Math.sin(this.avatarState.emoteFrame * 3) * 0.8;
      armRightAngle = -Math.sin(this.avatarState.emoteFrame * 3) * 0.8;
    } else if (this.avatarState.activeEmote === 'clap') {
      armLeftAngle = -Math.PI / 2.2 + Math.sin(this.avatarState.emoteFrame * 6) * 0.15;
      armRightAngle = -Math.PI / 2.2 - Math.sin(this.avatarState.emoteFrame * 6) * 0.15;
    } else if (this.avatarState.activeEmote === 'sit') {
      bobY = 40;
      legOffset = 25;
    }

    ctx.save();
    ctx.translate(centerX, centerY + bobY);

    // 1. Acessório Traseiro (Asas ou Capa se estiver de costas/frente)
    if (this.avatarState.accessory === 'acc_wings') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.beginPath();
      ctx.moveTo(-cosR * 30, -20);
      ctx.lineTo(-80, -90);
      ctx.lineTo(-70, -20);
      ctx.lineTo(-cosR * 20, 20);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cosR * 30, -20);
      ctx.lineTo(80, -90);
      ctx.lineTo(70, -20);
      ctx.lineTo(cosR * 20, 20);
      ctx.fill();
    } else if (this.avatarState.accessory === 'acc_cape') {
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(-28 * cosR - 22, -10, 44, 85);
    }

    // 2. Pernas (Blocky Legs)
    ctx.fillStyle = this.avatarState.legColor;
    // Perna Esquerda
    ctx.fillRect(-28 * cosR - 18, 50 - legOffset, 16, 55 + legOffset);
    // Perna Direita
    ctx.fillRect(28 * cosR + 2, 50 - legOffset, 16, 55 + legOffset);

    // Contorno de sapatos
    ctx.fillStyle = '#111317';
    ctx.fillRect(-28 * cosR - 18, 95, 16, 12);
    ctx.fillRect(28 * cosR + 2, 95, 16, 12);

    // 3. Tronco (Blocky Torso)
    ctx.fillStyle = this.avatarState.torsoColor;
    const torsoW = 44 * Math.max(0.4, Math.abs(cosR));
    ctx.fillRect(-torsoW / 2, -15, torsoW, 65);

    // Cinto / detalhe do tronco
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-torsoW / 2, 40, torsoW, 10);

    // 4. Braço Esquerdo
    ctx.save();
    ctx.translate(-torsoW / 2 - 8, -10);
    ctx.rotate(armLeftAngle);
    ctx.fillStyle = this.avatarState.skinColor;
    ctx.fillRect(-8, 0, 14, 55);
    ctx.fillStyle = this.avatarState.torsoColor;
    ctx.fillRect(-8, 0, 14, 20); // Manga da camisa
    ctx.restore();

    // 5. Braço Direito (com Item da Hotbar se equipado)
    ctx.save();
    ctx.translate(torsoW / 2 + 8, -10);
    ctx.rotate(armRightAngle);
    ctx.fillStyle = this.avatarState.skinColor;
    ctx.fillRect(-6, 0, 14, 55);
    ctx.fillStyle = this.avatarState.torsoColor;
    ctx.fillRect(-6, 0, 14, 20); // Manga da camisa

    // Renderizar Item da Hotbar na Mão Direita
    const activeItem = this.hotbarItems[this.activeSlot];
    if (activeItem) {
      ctx.font = '22px sans-serif';
      ctx.fillText(activeItem.icon, 2, 60);
    }
    ctx.restore();

    // 6. Cabeça (Blocky Head)
    ctx.fillStyle = this.avatarState.skinColor;
    const headSize = 46;
    ctx.fillRect(-headSize / 2, -headSize - 15, headSize, headSize);

    // Rosto (Olhos e Sorriso clássico estilizado, visível se estiver virado para frente)
    if (cosR >= -0.2) {
      const faceShiftX = sinR * 12;
      ctx.fillStyle = '#111827';
      // Olho Esquerdo
      ctx.fillRect(-14 + faceShiftX, -45, 6, 8);
      // Olho Direito
      ctx.fillRect(8 + faceShiftX, -45, 6, 8);
      // Sorriso
      ctx.fillRect(-10 + faceShiftX, -30, 20, 4);
    }

    // 7. Chapéu / Cabelo
    if (this.avatarState.hat === 'hair_classic') {
      ctx.fillStyle = '#451A03';
      ctx.fillRect(-headSize / 2 - 2, -headSize - 18, headSize + 4, 14);
      ctx.fillRect(-headSize / 2 - 4, -headSize - 18, 8, 22);
    } else if (this.avatarState.hat === 'hat_cap') {
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-headSize / 2 - 2, -headSize - 20, headSize + 4, 16);
      ctx.fillRect(-headSize / 2 - 12, -headSize - 8, 22, 6); // Aba do boné
    } else if (this.avatarState.hat === 'hat_crown') {
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(-headSize / 2, -headSize - 25, headSize, 12);
      // Pontas da coroa
      ctx.beginPath();
      ctx.moveTo(-headSize / 2, -headSize - 25);
      ctx.lineTo(-headSize / 2 + 8, -headSize - 35);
      ctx.lineTo(-headSize / 2 + 16, -headSize - 25);
      ctx.lineTo(0, -headSize - 38);
      ctx.lineTo(headSize / 2 - 16, -headSize - 25);
      ctx.lineTo(headSize / 2 - 8, -headSize - 35);
      ctx.lineTo(headSize / 2, -headSize - 25);
      ctx.fill();
    } else if (this.avatarState.hat === 'hat_helm') {
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-headSize / 2 - 3, -headSize - 20, headSize + 6, 32);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-headSize / 2 + 6, -headSize - 5, headSize - 12, 10);
    }

    ctx.restore();
  }

  /* ========================================================
     MODAIS E CONTROLE DO MENU ESC
     ======================================================== */
  openEscapeMenu(targetTab = 'tab-home') {
    const modal = document.getElementById('modal-escape');
    if (!modal) return;

    modal.classList.add('open');
    this.switchEscTab(targetTab);
    this.playSound('click');
  }

  closeEscapeMenu() {
    const modal = document.getElementById('modal-escape');
    if (modal) {
      modal.classList.remove('open');
      this.playSound('click');
    }
  }

  toggleEscapeMenu() {
    const modal = document.getElementById('modal-escape');
    if (modal && modal.classList.contains('open')) {
      this.closeEscapeMenu();
    } else {
      this.openEscapeMenu();
    }
  }

  switchEscTab(tabId) {
    this.activeEscTab = tabId;
    document.querySelectorAll('.esc-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });

    document.querySelectorAll('.escape-content-body .tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });

    if (tabId === 'tab-avatar-inner') {
      setTimeout(() => this.drawAvatarPreview(), 50);
    }
  }

  /* ========================================================
     EXPORTADOR DE YAML DO ULTIMATE UI
     ======================================================== */
  async loadYamlConfigs() {
    try {
      const files = ['hud.yml', 'escape_menu.yml', 'avatar_menu.yml', 'home_menu.yml'];
      for (const f of files) {
        const res = await fetch(`ultimate_ui_configs/${f}`);
        if (res.ok) {
          this.yamlConfigs[f] = await res.text();
        }
      }
    } catch (e) {
      console.warn('Carregamento de configs locais:', e);
    }
  }

  showYamlInExporter(filename) {
    const codeEl = document.getElementById('yaml-code-display');
    const downloadBtn = document.getElementById('btn-download-yaml');
    if (!codeEl) return;

    const code = this.yamlConfigs[filename] || '# Arquivo de configuração Ultimate UI\nid: ' + filename;
    codeEl.innerText = code;

    if (downloadBtn) {
      downloadBtn.setAttribute('href', 'data:text/yaml;charset=utf-8,' + encodeURIComponent(code));
      downloadBtn.setAttribute('download', filename);
    }

    document.querySelectorAll('.exp-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.file === filename);
    });
  }

  openExporterModal() {
    const modal = document.getElementById('modal-exporter');
    if (!modal) return;
    modal.classList.add('open');
    this.showYamlInExporter('hud.yml');
    this.playSound('click');
  }

  closeExporterModal() {
    const modal = document.getElementById('modal-exporter');
    if (modal) {
      modal.classList.remove('open');
      this.playSound('click');
    }
  }

  /* ========================================================
     TOAST DE NOTIFICAÇÃO
     ======================================================== */
  showToast(message) {
    const toast = document.getElementById('toast-notify');
    const text = document.getElementById('toast-text');
    if (!toast || !text) return;

    text.innerText = message;
    toast.classList.add('show');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  /* ========================================================
     EVENT LISTENERS & BINDINGS
     ======================================================== */
  bindEvents() {
    // 1. Botões do Top Bar HUD
    document.getElementById('hud-btn-menu')?.addEventListener('click', () => {
      this.toggleEscapeMenu();
    });

    document.getElementById('hud-btn-chat')?.addEventListener('click', () => {
      const chat = document.getElementById('chat-overlay');
      if (chat) {
        chat.classList.toggle('hidden');
        this.playSound('click');
        if (!chat.classList.contains('hidden')) {
          document.getElementById('chat-input')?.focus();
        }
      }
    });

    document.getElementById('hud-btn-leaderboard')?.addEventListener('click', () => {
      const lb = document.getElementById('leaderboard-overlay');
      if (lb) {
        lb.classList.toggle('hidden');
        this.playSound('click');
      }
    });

    document.getElementById('hud-btn-avatar')?.addEventListener('click', () => {
      this.openEscapeMenu('tab-avatar-inner');
    });

    document.getElementById('hud-btn-home')?.addEventListener('click', () => {
      this.openEscapeMenu('tab-home');
    });

    document.getElementById('hud-btn-backpack')?.addEventListener('click', () => {
      const hotbar = document.getElementById('hotbar-container');
      if (hotbar) {
        hotbar.style.display = hotbar.style.display === 'none' ? 'flex' : 'none';
        this.playSound('click');
        this.showToast(hotbar.style.display === 'none' ? 'Hotbar ocultada' : 'Hotbar visível');
      }
    });

    document.getElementById('hud-btn-sound')?.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      const icon = document.getElementById('sound-icon');
      if (icon) {
        icon.style.opacity = this.soundEnabled ? '1' : '0.4';
      }
      this.showToast(this.soundEnabled ? 'Sons da interface ativados' : 'Sons desativados');
    });

    // 2. Chat Input e Envio
    document.getElementById('btn-close-chat')?.addEventListener('click', () => {
      document.getElementById('chat-overlay')?.classList.add('hidden');
      this.playSound('click');
    });

    document.getElementById('btn-close-leaderboard')?.addEventListener('click', () => {
      document.getElementById('leaderboard-overlay')?.classList.add('hidden');
      this.playSound('click');
    });

    document.getElementById('chat-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      if (input && input.value) {
        this.sendChatMessage(input.value);
        input.value = '';
      }
    });

    // Abas do chat
    document.querySelectorAll('.chat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentChatChannel = tab.dataset.channel;
        this.playSound('click');
      });
    });

    // 3. Controles de Simulação (Fundo, Dano, Cura, YAML)
    document.getElementById('btn-toggle-bg')?.addEventListener('click', () => {
      const viewport = document.getElementById('game-viewport');
      if (viewport) {
        viewport.classList.toggle('dark-flat');
        this.playSound('click');
        this.showToast(viewport.classList.contains('dark-flat') ? 'Modo de fundo plano escuro ativado' : 'Cenário 3D Minecraft ativado');
      }
    });

    document.getElementById('btn-damage')?.addEventListener('click', () => {
      this.playSound('damage');
      this.setHealth(this.health - 20);
    });

    document.getElementById('btn-heal')?.addEventListener('click', () => {
      this.playSound('heal');
      this.setHealth(this.health + 20);
    });

    document.getElementById('btn-open-exporter')?.addEventListener('click', () => {
      this.openExporterModal();
    });

    document.getElementById('btn-close-exporter')?.addEventListener('click', () => {
      this.closeExporterModal();
    });

    document.querySelectorAll('.exp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.showYamlInExporter(tab.dataset.file);
        this.playSound('click');
      });
    });

    document.getElementById('btn-copy-yaml')?.addEventListener('click', () => {
      const code = document.getElementById('yaml-code-display')?.innerText;
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          this.showToast('Código YAML copiado para a área de transferência!');
          this.playSound('pop');
        });
      }
    });

    // 4. Abas do Menu ESC
    document.querySelectorAll('.esc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchEscTab(tab.dataset.tab);
        this.playSound('click');
      });
    });

    document.getElementById('btn-close-escape')?.addEventListener('click', () => {
      this.closeEscapeMenu();
    });

    document.getElementById('home-resume-btn')?.addEventListener('click', () => {
      this.closeEscapeMenu();
    });

    document.getElementById('home-open-avatar-btn')?.addEventListener('click', () => {
      this.switchEscTab('tab-avatar-inner');
      this.playSound('click');
    });

    // Subabas do Avatar
    document.querySelectorAll('.avatar-subtabs .subtab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.avatar-subtabs .subtab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.subtab;
        document.querySelectorAll('.avatar-options-col .subtab-pane').forEach(p => {
          p.classList.toggle('active', p.id === target);
        });
        this.playSound('click');
      });
    });

    // 5. Configurações estilo Roblox
    // Volume Slider
    document.getElementById('slider-volume')?.addEventListener('input', (e) => {
      document.getElementById('val-volume').innerText = `${e.target.value}%`;
    });

    // Qualidade Gráfica (10 bolinhas)
    document.querySelectorAll('#graphics-dots .dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const level = parseInt(dot.dataset.level, 10);
        document.querySelectorAll('#graphics-dots .dot').forEach((d, idx) => {
          d.classList.toggle('active', idx < level);
        });
        document.getElementById('val-graphics').innerText = `${level} / 10`;
        this.playSound('click');
      });
    });

    // FOV Slider
    document.getElementById('slider-fov')?.addEventListener('input', (e) => {
      document.getElementById('val-fov').innerText = `${e.target.value}°`;
    });

    // 6. Rodapé do Menu ESC
    document.getElementById('btn-footer-resume')?.addEventListener('click', () => {
      this.closeEscapeMenu();
    });

    document.getElementById('btn-footer-reset')?.addEventListener('click', () => {
      document.getElementById('dialog-reset')?.classList.add('open');
      this.playSound('click');
    });

    document.getElementById('btn-cancel-reset')?.addEventListener('click', () => {
      document.getElementById('dialog-reset')?.classList.remove('open');
      this.playSound('click');
    });

    document.getElementById('btn-confirm-reset')?.addEventListener('click', () => {
      document.getElementById('dialog-reset')?.classList.remove('open');
      this.closeEscapeMenu();
      this.playSound('damage');
      this.showToast('Personagem reiniciado no ponto de spawn!');
      this.setHealth(100);
    });

    document.getElementById('btn-footer-leave')?.addEventListener('click', () => {
      this.showToast('Desconectando do servidor... Redirecionando ao Lobby.');
      this.playSound('click');
      setTimeout(() => {
        this.closeEscapeMenu();
      }, 1000);
    });

    // 7. Atalhos de Teclado (ESC, TAB, T, 1-9)
    window.addEventListener('keydown', (e) => {
      // Se estiver digitando no input do chat, ignora atalhos de jogo
      if (document.activeElement === document.getElementById('chat-input')) {
        if (e.key === 'Escape') {
          document.getElementById('chat-input').blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        this.toggleEscapeMenu();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const lb = document.getElementById('leaderboard-overlay');
        if (lb) lb.classList.toggle('hidden');
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        const chat = document.getElementById('chat-overlay');
        if (chat) {
          chat.classList.remove('hidden');
          document.getElementById('chat-input')?.focus();
        }
      } else if (e.key >= '1' && e.key <= '9') {
        const slotIdx = parseInt(e.key, 10) - 1;
        this.selectSlot(slotIdx);
      }
    });

    // Controles Mobile Virtuais
    document.getElementById('mobile-jump-btn')?.addEventListener('click', () => {
      this.playSound('pop');
      this.showToast('Pulo executado!');
    });

    document.getElementById('mobile-interact-btn')?.addEventListener('click', () => {
      this.playSound('click');
      const activeItem = this.hotbarItems[this.activeSlot];
      this.showToast(`Usou: ${activeItem.name}!`);
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.app = new RobloxStyleApp();
});
